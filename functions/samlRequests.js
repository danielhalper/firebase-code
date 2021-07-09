const functions = require('firebase-functions')
const SamlParser = require('saml2js')
const admin = require('firebase-admin')
const airtable = require('airtable')
const twilio = require('twilio')
const { FunctionInstance } = require('twilio/lib/rest/serverless/v1/service/function')
const { firestore } = require('firebase-admin')
const { user } = require('firebase-functions/lib/providers/auth')

const twilioAccountSid = functions.config().twilio.account_sid
const twilioAuthToken = functions.config().twilio.auth_token

const twilioClient = new twilio(twilioAccountSid, twilioAuthToken)


const twilioAnnouncementNumber = 'MGa19edba57db255edc0cbcbe15f392a44'

exports.samlACSCallback = functions.https.onRequest(async (req, res) => {
    console.log(req.body.SAMLResponse)
    const samlParser = new SamlParser(req.body.SAMLResponse)

    res.send(samlParser.toObject())

})