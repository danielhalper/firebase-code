const functions = require('firebase-functions') //Cloud Functions
const admin = require('firebase-admin') //Firebase Admin SDK
const jwt = require('jsonwebtoken')
const airtable = require('airtable') //Airtable API Client
const twilio = require('twilio') //Twilio SDK
const { Translate } = require('@google-cloud/translate').v2 //Google Translate
const { parsePhoneNumber } = require('libphonenumber-js') //For formatting phone numbers correctly
const fetch = require('node-fetch')

//Get Twilio credentials
const twilioAccountSid = functions.config().twilio.account_sid
const twilioAuthToken = functions.config().twilio.auth_token

//Get the "password" string used to verify Zapier requests
const zapierAuthToken = functions.config().zapier.auth_token

//Zoom credentials
const zoomAPIKey = functions.config().zoom.api_key
const zoomAPISecret = functions.config().zoom.api_secret

//Create a twilio client
const twilioClient = new twilio(twilioAccountSid, twilioAuthToken)

//List of our tutor messaging numbers
const twilioTutorNumbersList = ['+12133751458', '+12133750936', '+12132676947', '+12133750502', '+12133762955']

//For sending TwiML responses
function twilioSend(res, data) {
    res.type('text/xml')
    res.send(data)
}

//To send a voice response saying a message through TwiML
function twilioSayMessage(res, message) {
    const response = new twilio.twiml.VoiceResponse()
    response.say(message)
    res.type('text/xml')
    res.send(response.toString())
}

class PhoneMatchingError extends Error {
    constructor(message) {
        super(message)
        this.name = 'PhoneMatchingError'
    }
}

exports.handleMessageToTutorNumber = functions.https.onRequest(async (req, res) => {

    //Instantiate Google Translate
    const googleTranslate = new Translate()

    try {
        const { toPhone, personDoc, secondPersonDoc, role, fromNumber } = await matchPhoneNumberToCorrespondent(req)

        //Make sure it says they are communicating
        let docId = role == 'tutor' ? personDoc.id : secondPersonDoc.id
        updateCommunicatingStatus(docId, role)

        //Placeholder for the message
        let message = req.body.Body

        //Get their preferred language
        const preferredLanguage = secondPersonDoc.get('preferredLanguage')

        //If their preferred language exists...
        if (notNull(preferredLanguage)) {
            try {
                //Get the language code for it (defaults to English)
                const toLanguageCode = (preferredLanguage == 'Español') ? 'es' : 'en'

                //Now, translate the message
                const translation = await googleTranslate.translate(message, toLanguageCode)

                //Set the message to the translated version
                message = translation

            } catch(err) {
                console.log(err) //Errors relating to translation aren't necessarily critical errors
            }

        }

        //Next, forward the text message
        await forwardMessageTwilio(message, getMediaUrlList(req.body), toPhone, fromNumber)

        //Reply with an empty response
        twilioSend(res, new twilio.twiml.MessagingResponse().toString())

    } catch(err) {
        if (err instanceof PhoneMatchingError) {
            twilioSend(res, constructTwilioMessagingResponse(err.message))
        }
    }

})

exports.handleCallToTutorNumber = functions.https.onRequest(async (req, res) => {
    try {
        const { toPhone, personDoc, secondPersonDoc, role, fromNumber } = await matchPhoneNumberToCorrespondent(req)

        //Make sure it says they are communicating
        let docId = role == 'tutor' ? personDoc.id : secondPersonDoc.id
        updateCommunicatingStatus(docId, role)

        //Otherwise, dial them in to the other person
        const response = new twilio.twiml.VoiceResponse()

        //Create a potential action
        let action = undefined

        //If the student is calling the tutor and the tutor hasn't initiated contact, set the action
        action = `https://us-central1-stepup-dashboard.cloudfunctions.net/respondToPhonePickup?docId=${role == 'tutor' ? personDoc.id : secondPersonDoc.id}&role=${role}`

        //Dial the other person using the proxy number as a caller ID
        const dial = response.dial({
            callerId: fromNumber,
            action: action
        })

        dial.number(toPhone)

        //Send the response
        res.type('text/xml')
        res.send(response.toString())
    } catch(err) {
        if (err instanceof PhoneMatchingError) {
            twilioSayMessage(res, err.message)
        }
    }

})

exports.respondToPhonePickup = functions.https.onRequest(async (req, res) => {

    //Get the docId, if it exists
    const docId = req.query['docId']

    //Get the role if it exists
    const role = req.query['role']

    //Make sure the data exists
    if (!notNull(docId) || !notNull(role)) return

    //Make sure it says they are communicating
    updateCommunicatingStatus(docId, role == 'tutor' ? 'student':'tutor')

    //Send a hangup response
    const response = new twilio.twiml.VoiceResponse()
    response.hangup()
    res.send( response.toString() )

})

function getMediaUrlList(requestBody) {

    //Keep track of the media URLs
    let list = []

    //Incrementer
    let i = 0

    //As long as the MediaUrl at that index exists...
    while (notNull(requestBody[`MediaUrl${i}`])) {

        //Add it to the list
        list.push(requestBody[`MediaUrl${i}`])

        //Go to the next one
        i++

    }

    //Return the list
    return list

}

//Util function
function notNull(value) {
    return value != null && value != undefined
}

async function forwardMessageTwilio(message, mediaUrlList, phone, fromPhone) {

    //Send a text message (same as received) to the given phone number
    return await twilioClient.messages.create({
        body: message,
        to: phone,
        from: fromPhone,
        mediaUrl: mediaUrlList
    })

}

//For creating a messaging response
function constructTwilioMessagingResponse(message) {
    const response = new twilio.twiml.MessagingResponse()
    response.message(message)
    return response.toString()
}

async function matchPhoneNumberToCorrespondent(req) {

    //Get the phone number that we're receiving from
    const from = req.body.From

    //Get the phone number being sent to
    const to = req.body.To

    //This is a hack to work around the fact that I can't end this function from inside another function
    let keepGoing = true

    //Use that phone number as a key to retrieve a tutor or parent record
    const personDoc = await getRecordFromPhone(from).catch(error => {
        keepGoing = false
    })

    if (!keepGoing) throw new PhoneMatchingError(`StepUp Tutoring here! It looks like your number was formatted incorrectly when you signed up.`)

    //Make sure the person's record exists
    if (!notNull(personDoc)) {
        throw new PhoneMatchingError(`Could not find your record`)
    }

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
        throw new Error(`StepUp Tutoring here! It looks like you haven't been matched with a ${role == 'tutor' ? 'student':'tutor'} yet. If this doesn't sound right, please contact laura@stepuptutoring.org`)
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
        throw new PhoneMatchingError(`Step Up Tutoring here! It looks like this is the wrong number for your ${role == 'tutor' ? 'student': 'tutor'}!`)

    }

    //If that person doesn't exist, send a message
    if (!secondPersonDoc.exists) {
        throw new PhoneMatchingError("We couldn't find your correspondent in our database!")
    }

    //Otherwise, get their phone number
    const toPhone = secondPersonDoc.get('phone')

    //If their phone doesn't exist, send an explanation
    if (!notNull(toPhone)) {
        throw new PhoneMatchingError(`Step Up Tutoring Here! The person you're trying to contact hasn't set up their phone number with us yet. You may have to contact Step Up staff for assistance.`)
    }

    return {
        toPhone,
        personDoc,
        secondPersonDoc,
        role,
        fromNumber: to
    }

}

function updateCommunicatingStatus(docId, role) {

    let data = {}
    
    if (role == 'tutor') data['Tutor communicating?'] = 'yes'
    if (role == 'student') data['Family communicating?'] = 'yes'

    //Update AirTable to reflect their communication status
    const airtableAPIKey = functions.config().airtable.key
    const base = new airtable({ apiKey: airtableAPIKey}).base('appk1SzoRcgno7XQT')

    base('Tutors').update([{

        id: docId,
        fields: data

    }]).catch(err => console.log(err))


}

//Probably to be deprecated; replaced by updates via Zapier integrations with AirTable
exports.syncPeopleData = functions.pubsub.schedule('every 24 hours').onRun((context) => {

    console.log('Running')
    updatePeopleData().then(result => console.log('Finished Syncing People'))

})

const findInactiveTutorsFunc = async context => {

    //Keep track of the tutors to consider
    let tutors = []

    //Get the critical date
    const dateToConsider = new Date()
    dateToConsider.setDate(dateToConsider.getDate() - 3)

    //Format the critical date
    const criticalDate = dateToConsider.toISOString().substring(0, 10)

    //First, get all the potentially non-communicative tutors
    const airtableAPIKey = functions.config().airtable.key
    const base = new airtable({ apiKey: airtableAPIKey}).base('appk1SzoRcgno7XQT')

    await base('Tutors').select({
        filterByFormula: `AND(Status = "Matched", OR({Tutor communicating?} = BLANK(), {Family communicating?} = BLANK()))`,
        view: 'Matched Tutors',
        fields: ['Match date', 'Tutor communicating?', 'Family communicating?']
    }).eachPage((records, fetchNextPage) => {
        records.forEach(record => {

            //Get their matched date
            let matchedDate = record.fields['Match date']
            if (Array.isArray(matchedDate)) matchedDate = matchedDate[0]

            //Check if it's before the critical date
            if (matchedDate < criticalDate) tutors.push(record)

        })

        //Go to the next page
        fetchNextPage()

    }).catch(error => {
        console.log(error)
    })

    //Keep track of the records to update
    let updatedRecords = []


    //Go through and update all the AirTable records
    for (let i = 0; i < tutors.length; i++) {

        //Check to see if the tutor has been communicating
        if (!notNull(tutors[i].fields['Tutor communicating?'])) {

            //If the tutor hasn't been communicating, update the record
            updatedRecords.push({
                id: tutors[i].id,
                fields: {
                    'Tutor communicating?': 'no'
                }
            })

            //Continue
            continue

        }

        //If the tutor isn't communicating, skip them
        else if (tutors[i].fields['Tutor communicating?'] == 'no') continue

        //If the tutor has been communicating, check if the parents haven't
        if (!notNull(tutors[i].fields['Family communicating?'])) {

            //Update the record
            updatedRecords.push({
                id: tutors[i].id,
                fields: {
                    'Family communicating?': 'no'
                }
            })

        }

    }

    //Chunk the array 10 at a time for AirTable to process
    let arrayChunks = []

    var i,j,temparray,chunk = 10;
    for (i=0,j=updatedRecords.length; i<j; i+=chunk) {
        temparray = updatedRecords.slice(i,i+chunk);
        arrayChunks.push(temparray)
    }

    //Update all the records
    for (let i = 0; i < arrayChunks.length; i++) {

        //Do the update
        await base('Tutors').update(arrayChunks[i]).catch(error => console.log(error))

        //Timeout to avoid hitting AirTable's rate limit
        await new Promise(r => setTimeout(r, 200))
    }

}

exports.findInactiveTutors = functions.pubsub.schedule('every 24 hours').onRun(findInactiveTutorsFunc)

exports.onNewStudentRow = functions.https.onRequest(async (req, res) => {

    return updatePersonRecord(req, res, 'student')

})

//Could probably be consolidated with `onNewStudentRow`
exports.onNewTutorRow = functions.https.onRequest(async (req, res) => {

    return updatePersonRecord(req, res, 'tutor')

})

async function updatePersonRecord(req, res, role) {

    //First check for authentication
    const authToken = req.body['authToken']

    //Make sure it exists and is correct
    if (!notNull(authToken) || authToken != zapierAuthToken) { res.status(401); res.send(); return }

    //Get the record id
    const recordId = req.body['record_id']

    //Get the potential firestore doc for that record id
    const firestoreDoc = await admin.firestore().collection('people').doc(recordId).get()

    //Get the updated record data
    const newRecordData = await getUpdatedRecordData({ fields: req.body }, firestoreDoc, role)

    //Set the new data
    await firestoreDoc.ref.set(newRecordData, { merge: true })

    res.send({
        status: 'success'
    })

}

//Hopefully will be deprecated in favor of incremental updates as they come, but comes in handy when we need to make sure everything is synced up
async function updatePeopleData() {

    //Keep track of the number of writes (for debugging and cost estimating)
    let writes = 0

    //AirTable setup
    const airtableAPIKey = functions.config().airtable.key
    const base = new airtable({ apiKey: airtableAPIKey}).base('appk1SzoRcgno7XQT')

    //Get the tutor data from AirTable
    await base('Tutors').select({
        fields: ['First Name', 'Last Name', 'Email', 'Phone', 'Students', 'Tutor ID', 'Match date', 'StepUp Email'],
        offset: 0
    }).eachPage((records, fetchNextPage) => {
        let _records = records

        //Get the list of ids
        const docIds = records.map(value => {
            return admin.firestore().collection('people').doc(value.id)
        })

        admin.firestore().getAll(...docIds).then(docs => {

            //Create a new batch
            const batch = admin.firestore().batch()

            //Organize the docs into a dictionary
            const docsDict = docs.reduce( (a, x) => ({...a, [x.id]: x }), {} )

            //Now that we have the documents that go with this page of records, we keep track of which ones to update/create
            let documentsToUpdate = []

            let promises = []

            _records.forEach(record => {

                //Get the appropriate document
                const firestoreDoc = docsDict[ record.id ]

                //If they're not equal, add it to the documents we need to update
                if (!recordsAreEqual(record, firestoreDoc)) {

                    promises.push( getUpdatedRecordData(record, firestoreDoc, 'tutor').then(result => {
                        documentsToUpdate.push({ doc: firestoreDoc.ref, data: result })
                    }) )


                }

            })

            Promise.allSettled(promises).then(results => {

                //Use the newly created list of documents to update to make a batch operation
                for (let i = 0; i < documentsToUpdate.length; i++) {

                    //Set the data to the doc
                    batch.set(documentsToUpdate[i].doc, documentsToUpdate[i].data)

                    writes++

                }

                //Commit the batch
                batch.commit()

                //Fetch the next page
                fetchNextPage()

            })

        })



    }).catch(err => {
        console.log(err)
    })

    //Get the student data from AirTable
    return await base('Students').select({
        fields: ['Student ID', 'First Name', 'Last Name', "Guardian's Email", "Guardian's Phone", 'Tutors', 'Language'],
        offset: 0,
    }).eachPage((records, fetchNextPage) => {

        let _records = records

        //Get the list of ids
        const docIds = records.map(value => {
            return admin.firestore().collection('people').doc(value.id)
        })

        admin.firestore().getAll(...docIds).then(docs => {

            //Create a new batch
            const batch = admin.firestore().batch()

            //Organize the docs into a dictionary
            const docsDict = docs.reduce( (a, x) => ({...a, [x.id]: x }), {} )

            //Now that we have the documents that go with this page of records, we keep track of which ones to update/create
            let documentsToUpdate = []

            let promises = []

            _records.forEach(record => {

                //Get the appropriate document
                const firestoreDoc = docsDict[ record.id ]

                //If they're not equal, add it to the documents we need to update
                if (!recordsAreEqual(record, firestoreDoc, 'student')) {

                    promises.push( getUpdatedRecordData(record, firestoreDoc, 'student').then(result => {
                        documentsToUpdate.push({ doc: firestoreDoc.ref, data: result })
                    }) )

                }

            })

            Promise.allSettled(promises).then(result => {

                //Use the newly created list of documents to update to make a batch operation
                for (let i = 0; i < documentsToUpdate.length; i++) {

                    //Set the data to the doc
                    batch.set(documentsToUpdate[i].doc, documentsToUpdate[i].data)

                    writes++

                }

                //Commit the batch
                batch.commit()

                //Fetch the next page
                fetchNextPage()

            })

        })



    }).catch(err => {
        console.log(err)
    }).then(result => {
        console.log(`Total Writes: ${writes}`)
    })

}

function recordsAreEqual(airtableRecord, firestoreDoc, role='tutor') {

    //Define the proper name mappings
    let nameMappings = {
        'firstname': 'First Name',
        'lastname': 'Last Name',
        'email': role == 'tutor' ? 'Email' : "Guardian's Email",
        'phone': role == 'tutor' ? 'Phone' : "Guardian's Phone",
        'preferredLanguage': 'Language',
        'matched': 'Match date'
    }

    nameMappings[ role == 'tutor' ? 'students' : 'tutors' ] = role == 'tutor' ? 'Students': 'Tutors'

    //Get the fields from the doc
    const fields = firestoreDoc.data()

    //If the document doesn't exist, return false
    if (!firestoreDoc.exists) return false

    //For each field
    for (let item in fields) {

        //If it's the role item, skip it
        if (item == 'role') continue

        //If they're a tutor and it's the preferredLanguage item, skip it
        if (role == 'tutor' && item == 'preferredLanguage') continue

        //If it's looking at whether they've made a first contact, skip it
        if (item == 'didInitiateFirstContact') continue

        //If it's the students item or the tutor item...
        if (item == 'students' || item == 'tutors') {

            //If there were no students/tutors listed, return whether the list has a length of 0
            if (airtableRecord.fields[ nameMappings[ item ] ] == undefined) return Object.keys(fields[item]).length == 0

            //If the records have differing lengths, return false
            if (airtableRecord.fields[ nameMappings[ item ] ].length != Object.keys(fields[item]).length) return false

            //Otherwise, we'll have to loop through and check all the items
            for (let personId in fields[item]) {

                //If the item isn't included in the record, return false
                if ( !airtableRecord.fields[ nameMappings[ item ] ].includes( personId ) ) return false

            }

        }

        //If it's the 'matched' item
        if (item == 'matched') {

            //It there are none listed, return whether the list has a length of 0
            if (airtableRecord.fields[ nameMappings[ item ] ] == undefined) return fields[item].length == 0

            //If the records have differing lengths, return false
            if (airtableRecord.fields[ nameMappings[ item ] ].length != fields[item].length) return false

            //Otherwise, loop through
            for (let i = 0; i < fields[item].length; i++) {

                //Get the item
                const dateMatched = fields[item][i]

                //If it's not in the list, return false
                if ( !airtableRecord.fields[ nameMappings[ item ] ].includes( dateMatched ) ) return false

            }


        }

        //If it's a phone number...
        else if (item == 'phone') {

            //Get the parsed version of the phone number
            const rawPhoneNumber = airtableRecord.fields[ nameMappings[ item ] ] || ''

            try {
                const parsed = parsePhoneNumber(rawPhoneNumber, 'US').number
                if (parsed != fields[item]) return false
            } catch(error) {
                if (rawPhoneNumber != '') continue
                if (rawPhoneNumber != fields[item]) return false
            }

        }

        //For emails...
        else if (item == 'email') {

            //Get the value
            const fieldValue = airtableRecord.fields[ nameMappings[ item ] ] || ''

            //If the field value doesn't match the lowercased record value, return false
            if (fieldValue != fields[item].toLowerCase().trim()) return false

        }

        //For all other fields...
        else {

            //Get the value (and give it a default empty value)
            const fieldValue = airtableRecord.fields[ nameMappings[ item ] ] || ''

            //If the field value doesn't match the doc, return false
            if (fieldValue != fields[item]) return false

        }

    }

    //If nothing has returned false so far, return true
    return true

}

async function getUpdatedRecordData(record, firestoreDoc, role) {

    //Get corrected phone number
    let phoneNumber = ''
    if (record.fields[role == 'tutor' ? 'Phone' : "Guardian's Phone"] != undefined) {
        try {
            phoneNumber = parsePhoneNumber(record.fields[role == 'tutor' ? 'Phone' : "Guardian's Phone"], 'US').number
        } catch(error) {

        }
    }

    //Start the new data
    let newData = {
        'firstname': (record.fields['First Name'] || '').trim(),
        'lastname': (record.fields['Last Name'] || '').trim(),
        'email': (record.fields[role == 'tutor' ? 'Email' : "Guardian's Email"] || '').toLowerCase().trim(),
        'phone': phoneNumber,
        'role': role,
        'preferredLanguage': record.fields['Language'] || 'English',
        'didInitiateFirstContact': false
    }

    //** Currently not being used
    let matched = []

    if (!notNull(record.fields['Match date'])) matched = []
    else if (!Array.isArray(record.fields['Match date'])) matched = [ record.fields['Match date'] ]
    else matched = record.fields['Match date']

    if (role == 'tutor') {
        newData['matched'] = matched
    }
    //**

    //Keep track of the person's tutors/students and the phone numbers that are available to assign
    let correspondents = {}
    let zoomLinks = {}
    let restrictedTutorNumbers = []

    let airtableItems = record.fields[role == 'tutor' ? 'Students': 'Tutors']

    if (typeof airtableItems == 'string' || airtableItems instanceof String) airtableItems = airtableItems.split(',')

    if (!notNull(airtableItems)) return newData

    if (!Array.isArray(airtableItems)) airtableItems = [airtableItems]



    let missingItems = []
    let zoomMissingItems = []

    //If the firestore document exists...
    if (firestoreDoc.exists) {

        //Pass along the didInitiateFirstContact value
        const didInitiateFirstContact = firestoreDoc.get('didInitiateFirstContact')
        if (notNull(didInitiateFirstContact)) newData['didInitiateFirstContact'] = didInitiateFirstContact

        //Get the items
        const firestoreItems = firestoreDoc.get(role == 'tutor' ? 'students': 'tutors') || []

        //Get potential zoom links
        zoomLinks = firestoreDoc.get('zoomLinks') || {}

        if (notNull(airtableItems)) {

            for (let i = 0; i < airtableItems.length; i++) {

                //Get the item from the old list, if available
                const oldItem = firestoreItems[ airtableItems[i] ]

                //Is it in the old list?
                if ( notNull( oldItem ) ) {

                    //Add the old item to the correspondents
                    correspondents[ airtableItems[i] ] = oldItem

                    //Add the number to the restricted numbers, if it exists
                    if (notNull(oldItem)) restrictedTutorNumbers.push(oldItem)

                } else {

                    //Add the id to the missing items
                    missingItems.push(airtableItems[i])

                }

                //Collect missing zoom items
                if (!notNull( zoomLinks[ airtableItems[i] ] )) { zoomMissingItems.push(airtableItems[i]) }

            }

        }

    }

    else {

        if (notNull(airtableItems)) {
            missingItems = [...airtableItems]
            zoomMissingItems = [...airtableItems]
        }

    }

    //Go through the missing items
    for (let i = 0; i < missingItems.length; i++) {

        //For students, it just shows up as null
        let newItem = 'null'

        //For tutors, assign a proxy number to each student
        if (role == 'tutor') {

            //This should probably be randomized for load balancing
            const proxyNumber = getFirstAvailableTutorNumber(restrictedTutorNumbers)

            if (notNull(proxyNumber)) {
                newItem = proxyNumber
                restrictedTutorNumbers.push(proxyNumber)
            }

        }

        correspondents[ missingItems[i] ] = newItem

    }

    newData[role == 'tutor' ? 'students': 'tutors'] = correspondents

    try {

        //Create necessary zoom links
        for (let i = 0; i < zoomMissingItems.length; i++) {

            //Start the new item as null
            let newItem = 'null'

            //If they're a tutor, create a zoom link
            if (role == 'tutor') {
                newItem = await createZoomLinkForTutor((record.fields['StepUp Email'] || '').toLowerCase().trim())
            }

            if (notNull(newItem)) {
                //Set the zoom link
                zoomLinks[ zoomMissingItems[i] ] = newItem
            }

        }

        newData['zoomLinks'] = zoomLinks

    } catch(err) {

    }

    return newData


}

function getFirstAvailableTutorNumber(restrictedNumbers) {

    for (let i = 0; i < twilioTutorNumbersList.length; i++) {

        //Return the tutor number if it's not in the restricted numbers
        if (!restrictedNumbers.includes(twilioTutorNumbersList[i])) return twilioTutorNumbersList[i]

    }

    return undefined

}

async function getRecordFromPhone(phone) {

    const pn = parsePhoneNumber(phone, 'US').number

    //First, we'll try firestore
    const querySnapshot = await admin.firestore().collection('people').where('phone', '==', pn).get()

    //If we didn't get anything, stop
    if (querySnapshot.size == 0) return

    //Othwerwise, we'll return the first document
    return querySnapshot.docs[0]

}

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

async function createZoomLinkForTutor(email) {

    //Get a JWT for Zoom
    const token = createZoomJWT()

    const response = await fetch(`https://api.zoom.us/v2/users/${email}/meetings`, {
        method: 'post',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'topic': 'Step Up Tutoring Session',
            'type': 3,
            'settings': {
                'auto_recording': 'none',
                'allow_multiple_devices': true,
                'waiting_room': false,
                'use_pmi': false
            }
        })
    })

    const zoomTrackingWebhook = 'https://hooks.zapier.com/hooks/catch/7732277/b2u4fkr/'

    //Send zoom meeting id, student and tutor record ids 

    const resultData = await response.json()

    return resultData['id']

}


//If we're in an emulator, run updatePeopleData
if (process.env.FUNCTIONS_EMULATOR == true || process.env.FUNCTIONS_EMULATOR == 'true') updatePeopleData().then(result => console.log('Populated Firestore with data'))
