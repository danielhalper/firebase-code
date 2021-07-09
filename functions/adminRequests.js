const functions = require('firebase-functions')
const admin = require('firebase-admin')
const twilio = require('twilio')

const twilioAccountSid = functions.config().twilio.account_sid
const twilioAuthToken = functions.config().twilio.auth_token

const twilioClient = new twilio(twilioAccountSid, twilioAuthToken)


const twilioAnnouncementNumber = 'MGa19edba57db255edc0cbcbe15f392a44'

exports.listUsers = async function(data, context) {

    //First, check that the current user is an admin
    const currentUserRoles = await getUserRole(context)

    if (!currentUserRoles.includes('admin')) throw new functions.https.HttpsError('permission-denied', 'This operation requires admin access')

    //Get a page token
    const pageToken = data.pageToken

    //Get the page
    return admin.auth().listUsers(20, pageToken)

}

exports.listPrivilegedUsers = async function(data, context) {

    await verifyAdminAccess(context)

    //Get the user records where they have a role of admin or announcer
    const userRecords = await admin.firestore().collection('users').where('roles', 'array-contains-any', ['admin', 'announcer']).get()

    //Get all the users with those uids
    const uids = userRecords.docs.map( record => {
        console.log(record.id)
        return { uid: record.id }
    } )
    
    const users = await admin.auth().getUsers(uids)

    //Merge the role data
    let userRolesIndex = {}
    for (let i = 0; i < userRecords.docs.length; i++) {
        console.log(userRecords.docs[i].get('roles'))
        userRolesIndex[ userRecords.docs[i].id ] = userRecords.docs[i].get('roles')
    }

    const userData = users.users.map(user => { return {...user, roles: userRolesIndex[user.uid] } })

    return {
        'users': userData
    }

}

exports.getUserByEmail = async function(data, context) {

    //First, check that the current user is an admin
    const currentUserRoles = await getUserRole(context)

    if (!currentUserRoles.includes('admin')) throw new functions.https.HttpsError('permission-denied', 'This operation requires admin access')

    //Get the email
    const email = data.email

    //Make sure the email isn't null
    if (!email) throw new functions.https.HttpsError('invalid-argument', 'You must pass an email to get a user')

    //Get the user by email
    const user = await admin.auth().getUserByEmail(email)

    //Get the roles
    const userRecord = await admin.firestore().collection('users').doc(user.uid).get()
    const roles = userRecord.get('roles')

    return { ...user.toJSON(), roles: roles }

}

exports.grantAdminAccess = async function(data, context) {

    //First, check that the current user is an admin
    const currentUserRoles = await getUserRole(context)

    if (!currentUserRoles.includes('admin')) throw new functions.https.HttpsError('permission-denied', 'This operation requires admin access')

    //Get the uid of the new admin-to-be
    const newAdminUid = data.uid

    //Make sure the uid exists
    if (!newAdminUid) throw new functions.https.HttpsError('invalid-argument', 'You must pass a uid to grant admin access')

    //Add the announcer role
    return await admin.firestore().collection('users').doc(newAdminUid).set({
        roles: admin.firestore.FieldValue.arrayUnion('admin')
    }, { merge: true })

}

exports.revokeAdminAccess = async function(data, context) {

    //First, check that the current user is an admin
    const currentUserRoles = await getUserRole(context)

    if (!currentUserRoles.includes('admin')) throw new functions.https.HttpsError('permission-denied', 'This operation requires admin access')

    //Get the uid of the admin
    const newAdminUid = data.uid

    //Make sure the uid exists
    if (!newAdminUid) throw new functions.https.HttpsError('invalid-argument', 'You must pass a uid to revoke admin access')

    //Add the announcer role
    return await admin.firestore().collection('users').doc(newAdminUid).set({
        roles: admin.firestore.FieldValue.arrayRemove('admin')
    }, { merge: true })

}

exports.grantAnnouncementAccess = async function(data, context) {

    //First, check that the current user is an admin
    const currentUserRoles = await getUserRole(context)

    if (!currentUserRoles.includes('admin')) throw new functions.https.HttpsError('permission-denied', 'This operation requires admin access')

    //Get the uid of the new announcer-to-be
    const newAdminUid = data.uid

    //Make sure the uid exists
    if (!newAdminUid) throw new functions.https.HttpsError('invalid-argument', 'You must pass a uid to grant announcer access')

    //Add the announcer role
    return await admin.firestore().collection('users').doc(newAdminUid).set({
        roles: admin.firestore.FieldValue.arrayUnion('announcer')
    }, { merge: true })

}


exports.revokeAnnouncementAccess = async function(data, context) {

    await verifyAdminAccess(context)

    //Get the uid of the announcer
    const newAdminUid = data.uid

    //Make sure the uid exists
    if (!newAdminUid) throw new functions.https.HttpsError('invalid-argument', 'You must pass a uid to revoke announcer access')

    //Add the announcer role
    return await admin.firestore().collection('users').doc(newAdminUid).set({
        roles: admin.firestore.FieldValue.arrayRemove('announcer')
    }, { merge: true })

}

exports.getTutorByEmail = async function(data, context) {

    await verifyAdminAccess(context)

    //Get the email
    const email = data.email

    //Make sure it exists
    if (!email) throw new functions.https.HttpsError('invalid-argument', 'You must pass an email to get a user')

    //Get the tutor record from Firestore
    const tutorRecordQuery = await admin.firestore().collection('people').where('role', '==', 'tutor').where('email', '==', email).get()

    //Make sure we got a response
    if (tutorRecordQuery.size == 0) throw new functions.https.HttpsError('not-found', 'We could not find that tutor')

    //Get the record
    const tutorRecord = tutorRecordQuery.docs[0]

    //Make data to return
    let tutorData = {
        id: tutorRecord.id,
        firstname: tutorRecord.get('firstname'),
        lastname: tutorRecord.get('lastname'),
        email: tutorRecord.get('email'),
        phone: tutorRecord.get('phone'),
        role: tutorRecord.get('role'),
        students: []
    }

    //Get all the student records
    const studentsDict = tutorRecord.get('students')

    for (let studentId in studentsDict) {

        //Get the record
        const studentRecord = await admin.firestore().collection('people').doc(studentId).get()

        //Make sure it exists
        if (studentRecord.exists) {

            //Create the data object
            let studentData = {
                id: studentRecord.id,
                firstname: studentRecord.get('firstname'),
                lastname: studentRecord.get('lastname'),
                email: studentRecord.get('email'),
                phone: studentRecord.get('phone'),
                role: studentRecord.get('role'),
                proxyNumber: studentsDict[studentId]
            }

            tutorData.students.push(studentData)

        }

    }

    //Return the tutor data
    return tutorData

}

exports.sendAnnouncement = async function(data, context) {

    await verifyAnnouncerAccess(context)

    //Get the message
    const message = data.message

    //Check that it exists
    if (!message) throw new functions.https.HttpsError('invalid-argument', 'You must provide a message')

    //Get the user segments to send it to
    const segments = data.segments

    //Check that it exists and is the right type
    if (!segments || !Array.isArray(segments)) throw new functions.https.HttpsError('invalid-argument', 'No segments selected')

    //Keep track of numbers to send to
    let toNumbers = []

    //For each segment...
    for (let i = 0; i < segments.length; i++) {

        //If it's a language segment
        if (['spanish', 'english'].includes(segments[i])) {

            //Get the families that speak that language
            const people = await admin.firestore().collection('people').where('preferredLanguage', '==', segments[i] == 'english' ? 'English' : 'Español').get()

            //Add those numbers
            toNumbers = toNumbers.concat(people.docs)

        } else if (segments[i] == 'tutors') {

            //Get all the tutors
            const people = await admin.firestore().collection('people').where('role', '==', 'tutor').get()

            //Add those people to the numbers
            toNumbers = toNumbers.concat(people.docs)

        }

    }

    //Create message promises
    const promises = []


    for (let i = 0; i < toNumbers.length; i++) {


        //Get the phone number
        const number = toNumbers[i].get('phone')

        //Drop it if it doesn't exist
        if (!number) continue

        //Otherwise, add a message promise
        promises.push( twilioClient.messages.create({
            body: message,
            messagingServiceSid: twilioAnnouncementNumber,
            to: number
        }) )

    }

    //Run them all
    Promise.all(promises)

    return {
        'status': 'success'
    }

}

exports.listMessages = async function(data, context) {

    //Verify admin access
    await verifyAdminAccess(context)

    //Get the tutor id
    const tutorId = data.tutorId

    //Check if it exists
    if (!tutorId) throw new functions.https.HttpsError('invalid-argument', 'You must provide a tutor ID')

    //Get the student id
    const studentId = data.studentId

    //Check if it exists
    if (!studentId) throw new functions.https.HttpsError('invalid-argument', 'You must provide a student ID')

    //Get the right tutor record
    const tutorRecord = await admin.firestore().collection('people').doc(tutorId).get()

    //Make sure it exists
    if (!tutorRecord) throw new functions.https.HttpsError('not-found', 'Tutor record not found')

    //Get the student record
    const studentRecord = await admin.firestore().collection('people').doc(studentId).get()

    //Make sure it exists
    if (!studentRecord) throw new functions.https.HttpsError('not-found', 'Student record not found')

    //Get the student records
    const studentNumber = studentRecord.get('phone')

    //Get the proxy number
    const proxyNumber = tutorRecord.get('students')[studentId]

    //Make sure the student exists
    if (!studentNumber || !proxyNumber) throw new functions.https.HttpsError('invalid-argument', 'Student number not found')

    //Get the phone number for that tutor
    const tutorPhoneNumber = tutorRecord.get('phone')

    //Check it exists
    if (!tutorPhoneNumber) throw new functions.https.HttpsError('invalid-argument', 'No phone number found')

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
        return second.dateSent - first.dateSent
    })


    allMessages = allMessages.map(item => { return {
        body: item.body,
        from: item.from,
        to: item.to,
        dateUpdated: item.dateUpdated,
        dateSent: item.dateSent,
        uri: item.uri
    } })

    return { messages: allMessages }

}






async function verifyAdminAccess(context) {
    //Check that the current user is an admin
    const currentUserRoles = await getUserRole(context)

    if (!currentUserRoles.includes('admin')) throw new functions.https.HttpsError('permission-denied', 'This operation requires admin access')
}

async function verifyAnnouncerAccess(context) {
    //Check that the current user is an admin
    const currentUserRoles = await getUserRole(context)

    if (!(currentUserRoles.includes('admin') || currentUserRoles.includes('announcer')) ) throw new functions.https.HttpsError('permission-denied', 'This operation requires admin access')
}

async function getUserRole(context) {

    const uid = context.auth.uid

    const user = await admin.firestore().collection('users').doc(uid).get()

    if (!user.exists) throw new functions.https.HttpsError('permission-denied', 'No role found')
    
    const roles = user.get('roles')

    if (!roles) throw new functions.https.HttpsError('permission-denied', 'No role found')

    return roles
    
}