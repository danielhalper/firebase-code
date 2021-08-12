const functions = require('firebase-functions')
const admin = require('firebase-admin')
const airtable = require('airtable')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const twilio = require('twilio')
const { Translate } = require('@google-cloud/translate').v2 //Google Translate
const { HttpsError } = require('firebase-functions/lib/providers/https')
const { firebaseConfig } = require('firebase-functions')

const twilioAccountSid = functions.config().twilio.account_sid
const twilioAuthToken = functions.config().twilio.auth_token

const twilioClient = new twilio(twilioAccountSid, twilioAuthToken)

//Zoom credentials
const zoomAPIKey = functions.config().zoom.api_key
const zoomAPISecret = functions.config().zoom.api_secret

//Step Up custom credentials
const stepUpTokenEncryptionKey = functions.config().stepup.token_encryption_key

//Util function
function notNull(value) {
    return value != null && value != undefined
}

//For getting the tutor data from an email
async function getTutorDataRaw(email) {

    //Get the airtable API key
    const airtableAPIKey = functions.config().airtable.key

    //Set up the airtable base
    const base = new airtable({ apiKey: airtableAPIKey}).base('appk1SzoRcgno7XQT')

    //Get the relevant record from the Tutors table
    const result = await base('Tutors').select({
        maxRecords: 1,
        filterByFormula: `{Email} = '${email.toLowerCase().trim()}'`,
        fields: ['Waiver?', 'Section 2', 'Email', 'First Name', 'Last Name', 'Status', 'Interview Date', 'Live Scan?', 'Live Training?']
    }).firstPage()

    //Throw if the tutor wasn't found
    if (result.length == 0) throw new Error('no-record-found')

    //Format it to send back
    const user = {
        "user": result[0]['_rawJson']['fields'] || {}
    }

    //Return
    return user

}

//For getting tutor data
exports.getTutorData = functions.https.onCall((data, context) => {

    return getTutorDataRaw(context.auth.token.email).then(tutor => {

        return tutor

    }).catch(error => {
        throw new functions.https.HttpsError('not-found', 'The tutor data for your account was not found.')
    })

})

exports.getOnboardingTutor = functions.https.onCall(async (data, context) => {

    //Verify the user
    const userData = await verifyOnboardingUser(context)

    //Return the data
    return userData

})

exports.getTutor = async (data, context) => {

    //Verify the user
    const userData = await verifyUser(context)

    //Create a user object
    let userObj = userData.data()

    if (notNull(userObj['students'])) {

        //Keep track of students
        let students = []

        //Go through the students
        for (let studentId in userObj['students']) {

            //Get their record
            const studentRecord = await admin.firestore().collection('people').doc(studentId).get()

            //Turn it into an object
            let studentObj = studentRecord.data()

            //TODO: Exclude phone number and email

            //Add the proxy number
            studentObj['proxyNumber'] = userObj['students'][studentId]

            //Add the id
            studentObj['id'] = studentId

            //Add it to the array of students
            students.push(studentObj)

        }

        //Update the students
        userObj['students'] = students

    }

    //Update the id
    userObj['id'] = userData.id

    //Now, return the data
    return userObj

}

exports.getMessagesForStudent = async (data, context) => {

    //Verify the user
    const userData = await verifyUser(context)

    //Next, get the student id
    const studentId = data.studentId

    //Make sure it exists
    if (!studentId) throw new functions.https.HttpsError('invalid-argument', 'You must provide a student ID')

    //Get the phone number the tutor uses to communicate with that student
    const proxyNumber = userData.get('students')[studentId]

    //Make sure it exists
    if (!proxyNumber) throw new functions.https.HttpsError('invalid-argument', 'You have not been assigned to this student')

    //Get the student's record
    const studentRecord = await admin.firestore().collection('people').doc(studentId).get()

    //Make sure it exists
    if (!studentRecord.exists) throw new functions.https.HttpsError('invalid-argument', 'That student does not exist')

    //Get the tutor's number
    const tutorNumber = userData.get('phone')

    //Get the student's number
    const studentNumber = studentRecord.get('phone')

    //Make sure they exist
    if (!tutorNumber || !studentNumber) throw new functions.https.HttpsError('invalid-argument', 'The phone numbers were not found')

    //Get tutor's messages
    const tutorMessages = await twilioClient.messages.list({
        from: proxyNumber,
        to: studentNumber,
        limit: 100
    })

    //Get student's messages
    const studentMessages = await twilioClient.messages.list({
        from: studentNumber,
        to: proxyNumber,
        limit: 100
    })

    //Combine the lists
    let allMessages = tutorMessages.concat(studentMessages)

    //Sort it by date sent
    allMessages.sort((first, second) => {
        return first.dateSent - second.dateSent
    })

    //Format it
    allMessages = allMessages.map(item => { return {
        body: item.body,
        from: item.from,
        to: item.to,
        dateUpdated: item.dateUpdated.toISOString(),
        dateSent: item.dateSent.toISOString(),
        uri: item.uri
    } })

    //Return the messages
    return { messages: allMessages }

}

exports.sendSMSMessage = async (data, context) => {

    //Verify the tutor
    const personDoc = await verifyUser(context)

    //Get the phone number to send to
    const to = data.phone

    //Make sure the number exists
    if (!to) throw new functions.https.HttpsError('invalid-argument', 'You must provide a valid phone number to send to')

    //Instantiate Google Translate
    const googleTranslate = new Translate()

    //Get the role of this person
    const role = personDoc.get('role')

    //Track their correspondents
    let correspondents;

    //If they're a tutor, get the students field
    if (role == 'tutor') correspondents = personDoc.get('students')

    //And vice versa for students
    else if (role == 'student') correspondents = personDoc.get('tutors')

    //If there are no correspondents, the tutor/student has not been matched yet; inform them of this
    if (!notNull(correspondents) || correspondents.length == 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Your record indicates that you have no students')
        return
    }

    //Keep track of the second person's record
    let secondPersonDoc;

    //If the person sending is a tutor...
    if (role == 'tutor') {

        //Go through their students
        for (let personId in correspondents) {

            //If the number assigned to that student is the one they texted...
            if (correspondents[personId] == to) {

                //Get the record of that student
                secondPersonDoc = await admin.firestore().collection('people').doc(personId).get()
                break

            }
        }

    }

    //If it's a student...
    else {

        //Find the tutor that is connected to this student through the phone number they sent the message to
        const querySnapshot = await admin.firestore().collection('people').where(`students.${personDoc.id}`, '==', to).get()

        //If there's a tutor in this query...
        if (querySnapshot.size >= 1) {


            //Get the first one
            secondPersonDoc = querySnapshot.docs[0]

        }

    }

    //Make sure the other person exists
    if (!notNull(secondPersonDoc)) {

        //If they don't have a student/tutor corresponding with this phone number, tell them
        throw new functions.https.HttpsError('invalid-argument', "This student doesn't exist")
        return

    }

    //If that person doesn't exist, send a message
    if (!secondPersonDoc.exists) {
        throw new functions.https.HttpsError('invalid-argument', "This student doesn't exist")
        return
    }

    //Otherwise, get their phone number
    const toPhone = secondPersonDoc.get('phone')

    //If their phone doesn't exist, send an explanation
    if (!notNull(toPhone)) {
        throw new functions.https.HttpsError('invalid-argument', `StepUpTutoring Here! The person you're trying to contact hasn't set up their phone number with us yet. You may have to contact StepUp staff for assistance.`)
        return
    }

    //Make sure it says they are communicating
    let airtableData = {}
    let docId = role == 'tutor' ? personDoc.id : secondPersonDoc.id
    if (role == 'tutor') airtableData['Tutor communicating?'] = 'yes'
    if (role == 'student') airtableData['Family communicating?'] = 'yes'

    //Update AirTable to reflect their communication status
    const airtableAPIKey = functions.config().airtable.key
    const base = new airtable({ apiKey: airtableAPIKey}).base('appk1SzoRcgno7XQT')

    base('Tutors').update([{

        id: docId,
        fields: airtableData

    }]).catch(err => console.log(err))



    //Placeholder for the message
    let message = data.message

    //Get their preferred language
    const preferredLanguage = secondPersonDoc.get('preferredLanguage')

    //If their preferred language exists...
    if (notNull(preferredLanguage)) {
        try {
            //Get the language code for it (defaults to English)
            const toLanguageCode = (preferredLanguage == 'Español') ? 'es' : 'en'

            //Now, translate the message
            const translation = await googleTranslate.translate(message, toLanguageCode)

            //Format the translations
            translation = Array.isArray(translation) ? translation : [translation]

            //Set the message to the translated version
            message = translation[0]

        } catch(err) {
            console.log(err) //Errors relating to translation aren't necessarily critical errors
        }

    }

    //Next, forward the text message
    const newMessage = await twilioClient.messages.create({
        to: toPhone,
        from: to,
        body: message
    })

    return {
        body: message,
        type: 'to',
        dateSent: newMessage.dateCreated.toISOString()
    }

}

exports.getZoomLinks = functions.https.onCall(async (data, context) => {

    //Verify the user
    const user = await verifyUser(context)

    //Get their zoom meeting IDs
    const zoomIds = user.get('zoomLinks')

    //Keep track of the links
    let studentLinks = {}

    //For each zoom id
    for (let student in zoomIds) {

        //Get the links for that meeting id
        const links = await getZoomLinksForMeeting(zoomIds[student])

        //Add that student's links to the response
        if (notNull(links)) studentLinks[student] = links

    }

    //Return the links
    return studentLinks

})

exports.getWeeklyAnnouncements = functions.https.onCall(async (data, context) => {

    const user = await verifyUser(context)

    //Get the airtable API key
    const airtableAPIKey = functions.config().airtable.key

    //Set up the airtable base
    const base = new airtable({ apiKey: airtableAPIKey}).base('appUYUSHT05HdV86G')

    //Get the relevant record from the Tutors table
    const result = await base('Announcements').select({
        filterByFormula: `{Status} = 'Ready (visible on tutor portal)'`,
    }).firstPage()

    return result.map(item => {
        return item['_rawJson']['fields']
    })
})

exports.getOnboardingAnnouncements = functions.https.onCall(async (data, context) => {

    //Verify the onboarding user
    const onboardingUser = await verifyOnboardingUser(context)

    //Get the airtable API key
    const airtableAPIKey = functions.config().airtable.key

    //Set up the airtable base
    const base = new airtable({ apiKey: airtableAPIKey}).base('appUYUSHT05HdV86G')

    //Get the relevant record from the Tutors table
    const result = await base('Announcements').select({
        filterByFormula: `{Status} = 'Ready (visible on onboarding portal)'`,
    }).firstPage()

    return result.map(item => {
        return item['_rawJson']['fields']
    })

})

exports.onNewUserCreated = functions.auth.user().onCreate((user) => {

    //Get the user's email
    const email = user.email

    //If it's not a StepUp email, they're an onboarding user
    if (email && !(/@stepuptutoring.org\s*$/.test(email))) {

        //Create an email sign in link
        const emailSignInLink = createPermanentSignInLink(email)

        //If in emulator, just console.log the link
        if (process.env.FUNCTIONS_EMULATOR == true || process.env.FUNCTIONS_EMULATOR == 'true') {
            console.log(`Your email sign in link is: ${emailSignInLink}`)
            return
        }

        //Now send a request to Zapier to send the email
        fetch('https://hooks.zapier.com/hooks/catch/7732277/buofpa4/', {
            method: 'post',
            body: JSON.stringify({
                email: email,
                signInLink: emailSignInLink
            })
        })

    }

})

exports.sendEmailSignInLink = functions.https.onCall(async (data, context) => {

    //Get the user's email
    const email = data.email

    let user;

    try {

        //Verify the email belongs to a user
        user = await admin.auth().getUserByEmail(email)

    } catch(err) {
        throw new HttpsError('permission-denied', 'No account exists for that email')
    }

    //If it's not a StepUp email, they're an onboarding user
    if (user) {

        if (!(/@stepuptutoring.org\s*$/.test(email))) {

            //Create an email sign in link
            const emailSignInLink = createPermanentSignInLink(email, data.returnUrl)

            //If in emulator, just console.log the link
            if (process.env.FUNCTIONS_EMULATOR == true || process.env.FUNCTIONS_EMULATOR == 'true') {
                console.log(`Your email sign in link is: ${emailSignInLink}`)
                return {
                    'status': 'success'
                }
            }

            //Now send a request to Zapier to send the email
            fetch('https://hooks.zapier.com/hooks/catch/7732277/bubhohh/', {
                method: 'post',
                body: JSON.stringify({
                    email: email,
                    signInLink: emailSignInLink
                })
            })

            return {
                'status': 'success'
            }

        } else {
            throw new HttpsError('invalid-argument', 'You must provide a non-StepUp email')
        }

    }

})

exports.getCustomAuthToken = functions.https.onCall(async (data, context) => {

    //Get the step up token
    const stepUpToken = data.stepUpToken

    //Make sure it exists
    if (!notNull(stepUpToken)) throw new HttpsError('unauthenticated', 'A valid token is required')

    //Validate the token
    try {

        //Decode the token
        const decoded = jwt.verify(stepUpToken, stepUpTokenEncryptionKey)

        //Get the user's email
        const email = decoded['sub']

        //Make sure it exists
        if (!notNull(email)) throw new HttpsError('invalid-argument', 'User email required')

        //Get the user with that email
        const user = await admin.auth().getUserByEmail(email)

        //Get the uid
        const uid = user.uid

        //Create a custom token for the user
        const customToken = await admin.auth().createCustomToken(uid)

        return {
            'customToken': customToken
        }

    } catch(err) {

        throw new HttpsError('permission-denied', 'Your token was invalid')

    }

})

function createZoomJWT() {

    //Create a payload
    const payload = {
        iss: zoomAPIKey,
        exp: ((new Date()).getTime() + 5000)
    }

    //Create the token
    const token = jwt.sign(payload, zoomAPISecret)

    return token

}

async function getZoomLinksForMeeting(meetingId) {

    //Get a JWT for Zoom
    const token = createZoomJWT()

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    const resultData = await response.json()

    return {
        'start_url': resultData['start_url'],
        'join_url': resultData['join_url']
    }

}

async function verifyUser(context) {

    //Get the user's email
    const email = context.auth.token.email

    //Find the record with that email (if it exists)
    const records = await admin.firestore().collection('people').where('stepUpEmail', '==', email).get()

    //Make sure it exists
    if (records.size < 1) throw new functions.https.HttpsError('permission-denied', 'You must be logged in to complete this action')

    //Get the first record
    const user = records.docs[0]

    //Return it
    return user

}

async function verifyOnboardingUser(context) {

    //Get the user's email
    const email = context.auth.token.email

    //Find the record with that email (if it exists)
    //Get the aritable API key
    const airtableAPIKey = functions.config().airtable.key

    //Set up the airtable base
    const base = new airtable({ apiKey: airtableAPIKey}).base('appk1SzoRcgno7XQT')

    //Get the relevant record from the Tutors table
    const result = await base('Tutors').select({
        maxRecords: 1,
        filterByFormula: `TRIM(LOWER({Email})) = '${email.toLowerCase().trim()}'`,
        fields: ['Waiver?', 'Creating Boundaries section', 'Math section', 'Section 1', 'Section 2', 'Email', 'First Name', 'Last Name', 'Status', 'Interview Date', 'Live Scan?', 'Live Training?']
    }).firstPage()

    //Make sure it exists
    if (result.length == 0) throw new functions.https.HttpsError('permission-denied', 'You must be signed in with the email you used in your application')

    //Return it
    return {
        firstname: result[0].fields['First Name'],
        lastname: result[0].fields['Last Name'],
        email: email,
        id: result[0].id,
        status: result[0].fields['Status'] || '',
        interviewDate: result[0].fields['Interview Date'] || null,
        waiverCompleted: result[0].fields['Waiver?'] || false,
        workbookForm1Completed: result[0].fields['Section 1'] || false,
        workbookForm2Completed: result[0].fields['Creating Boundaries section'] || false,
        workbookForm3Completed: result[0].fields['Math section'] || false,
        workbookForm4Completed: result[0].fields['Section 2'] || false,
        liveScanCompleted: result[0].fields['Live Scan?'] || false,
        liveTrainingCompleted: result[0].fields['Live Training?'] || false
    }

}

function createPermanentSignInLink(email, returnUrl) {

    const token = jwt.sign({
        iss: 'org.stepuptutoring',
        sub: email
    }, stepUpTokenEncryptionKey, {
        expiresIn: '300 days'
    })

    if (process.env.FUNCTIONS_EMULATOR == true || process.env.FUNCTIONS_EMULATOR == 'true') return `http://localhost:5000/signin.html?stepupToken=${encodeURIComponent(token)}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}`:'' }`

    return `https://stepup-dashboard.web.app/signin.html?stepupToken=${encodeURIComponent(token)}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}`:'' }`

}
