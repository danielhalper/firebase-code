const functions = require('firebase-functions') //Cloud Functions
const admin = require('firebase-admin') //Firebase Admin SDK
const adminRequests = require('./adminRequests') //Request callbacks for admin-related tasks
const tutorPortalRequests = require('./tutorPortalRequests') //Request callbacks for tutor portal tasks
const messaging = require('./messagingSystemRequests') //Request callbacks for messaging system tasks
const fs = require('fs')

//Start firebase admin
admin.initializeApp()

//Messaging System functions
exports.handleMessageToTutorNumber = messaging.handleMessageToTutorNumber
exports.handleCallToTutorNumber = messaging.handleCallToTutorNumber
exports.respondToPhonePickup = messaging.respondToPhonePickup
exports.syncPeopleData = messaging.syncPeopleData
exports.syncPeopleDataTest = messaging.syncPeopleDataTest
exports.findInactiveTutors = messaging.findInactiveTutors
exports.findInactiveTutorsTest = messaging.findInactiveTutorsTest
exports.onNewStudentRow = messaging.onNewStudentRow
exports.onNewTutorRow = messaging.onNewTutorRow
exports.zoomLinkTest = messaging.zoomLinkTest

exports.getUserRoles = functions.https.onCall(async (data, context) => {

    //Get the userId
    const userId = context.auth.uid

    //Get the data for the user
    const userRecord = await admin.firestore().collection('users').doc(userId).get()

    //Make sure it exists
    if (!userRecord) throw new functions.https.HttpsError('not-found', 'User not found')

    return { roles: userRecord.get('roles') || [] }

})

//Admin functions
exports.listPrivilegedUsers = functions.https.onCall(adminRequests.listPrivilegedUsers)
exports.getUserByEmail = functions.https.onCall(adminRequests.getUserByEmail)
exports.grantAdminAccess = functions.https.onCall(adminRequests.grantAdminAccess)
exports.revokeAdminAccess = functions.https.onCall(adminRequests.revokeAdminAccess)
exports.grantAnnouncerAccess = functions.https.onCall(adminRequests.grantAnnouncementAccess)
exports.revokeAnnouncerAccess = functions.https.onCall(adminRequests.revokeAnnouncementAccess)
exports.getTutorByEmail = functions.https.onCall(adminRequests.getTutorByEmail)
exports.sendAnnouncement = functions.https.onCall(adminRequests.sendAnnouncement)
exports.listMessages = functions.https.onCall(adminRequests.listMessages)

//Tutor portal functions
exports.getTutor = functions.https.onCall(tutorPortalRequests.getTutor)
exports.getMessagesForStudent = functions.https.onCall(tutorPortalRequests.getMessagesForStudent)
exports.sendSMSMessage = functions.https.onCall(tutorPortalRequests.sendSMSMessage)
exports.getTutorData = tutorPortalRequests.getTutorData
exports.getZoomLinks = tutorPortalRequests.getZoomLinks
exports.getOnboardingTutor = tutorPortalRequests.getOnboardingTutor
exports.onNewUserCreated = tutorPortalRequests.onNewUserCreated
exports.getCustomAuthToken = tutorPortalRequests.getCustomAuthToken
 
//Seed Firestore data
if (process.env.FUNCTIONS_EMULATOR == true || process.env.FUNCTIONS_EMULATOR == 'true') {

    const peopleData = JSON.parse(fs.readFileSync('./firestoreSeed.json', 'utf8'))

    let promises = []

    for (let personId in peopleData) {

        promises.push(admin.firestore().collection('people').doc(personId).set(peopleData[personId]))

    }

    Promise.allSettled(promises).then(result => console.log('Finished seeding'))

}