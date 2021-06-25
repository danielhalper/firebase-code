const jwt = require('jsonwebtoken')
const functions = require('firebase-functions') //Cloud Functions
const admin = require('firebase-admin') //Firebase Admin SDK

const zoomAPIKey = functions.config().zoom.apiKey 
const zoomAPISecret = functions.config().zoom.apiSecret 
