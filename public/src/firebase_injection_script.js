
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

            //Get the email
            const email = user.email

            if (email) {

                //If they are a SAML user, sign them out because they're not allowed to access onboarding
                firebase.auth().fetchSignInMethodsForEmail(email).then(methods => {

                    if (methods.indexOf(firebase.auth.GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD) != -1) {
                        firebase.auth().signOut().then(() => {
                            SIGN_IN_REDIRECT()
                        })
                    } else {

                        //Otherwise, run as usual
                        for (let i = 0; i < FIREBASE_RUN_ON_READY.length; i++) {
                            FIREBASE_RUN_ON_READY[i](user)
                        }     

                    }

                }).catch(error => {
                    firebase.auth().signOut().then(() => {
                        SIGN_IN_REDIRECT()
                    })
                })

            }   

        } else {
            if (firebase.auth().isSignInWithEmailLink(window.location.href) && !IS_LOGGING_OUT) {

                var email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                    email = window.prompt('Please provide your email for confirmation');
                }
            
                firebase.auth().signInWithEmailLink(email, window.location.href)
                    .then((result) => {
            
                        window.localStorage.removeItem('emailForSignIn');
                    
                    })
                    .catch((error) => {
                        SIGN_IN_REDIRECT()
                    });

                return
            }
            
            SIGN_IN_REDIRECT()
        }
    });
}

function SIGN_IN_REDIRECT() {
    if (window.location.hostname.includes('squarespace')) { 
        return 
    }
    window.location.href = `${EMULATOR ? 'http://localhost:5000/signin.html':`https://stepup-dashboard.web.app/signin.html`}?returnUrl=${encodeURIComponent(window.location.href)}`
}

async function SIGN_OUT_FIREBASE() {

    IS_LOGGING_OUT = true

    await firebase.auth().signOut()

    SIGN_IN_REDIRECT()

    return

}

setOnAuthChangedListener()


