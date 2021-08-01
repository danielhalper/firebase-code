
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDdWpO1sOAUe0U2GY5U7U4EFC3DoUtuSyU",
    authDomain: "stepup-dashboard.firebaseapp.com",
    projectId: "stepup-dashboard",
    storageBucket: "stepup-dashboard.appspot.com",
    messagingSenderId: "842016444797",
    appId: "1:842016444797:web:84a086e9291d94c42d7c14",
    measurementId: "G-VVZDPYH5ZH"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics()

EMULATOR = window.location.href.includes('localhost')

if (EMULATOR) firebase.auth().useEmulator('http://localhost:9099')

let FIREBASE_RUN_ON_READY = []

let IS_LOGGING_OUT = false

function setOnAuthChangedListener() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            
            for (let i = 0; i < FIREBASE_RUN_ON_READY.length; i++) {
                FIREBASE_RUN_ON_READY[i](user)
            }            

        } else {
            
            const provider = new firebase.auth.SAMLAuthProvider('saml.google.com')
            
            firebase.auth().signInWithRedirect(provider)

        }
    });
}

function SIGN_IN_REDIRECT() {
    const provider = new firebase.auth.SAMLAuthProvider('saml.google.com')
            
    firebase.auth().signInWithRedirect(provider)
}

async function SIGN_OUT_FIREBASE() {

    IS_LOGGING_OUT = true

    await firebase.auth().signOut()

    SIGN_IN_REDIRECT()

    return

}

setOnAuthChangedListener()

firebase.auth().getRedirectResult().then(result => {
    const user = result.user
    if (user) {
            
        for (let i = 0; i < FIREBASE_RUN_ON_READY.length; i++) {
            FIREBASE_RUN_ON_READY[i](user)
        }
        

    }

}).catch(error => {

    console.log('redirect_result')
    const provider = new firebase.auth.SAMLAuthProvider('saml.google.com')
            
    firebase.auth().signInWithRedirect(provider)
})

