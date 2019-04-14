import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/messaging';
import keys from '../config/keys';
import { setTokenSentToServer, sendTokenToServer } from './messaging';

const config = {
  apiKey: keys.apiKey || process.env.REACT_APP_API_KEY,
  authDomain: keys.authDomain || process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: keys.databaseURL || process.env.REACT_APP_DATABASE_URL,
  projectId: keys.projectId || process.env.REACT_APP_PROJECT_ID,
  storageBucket: keys.storageBucket || process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: keys.messagingSenderId || process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
    constructor() {
        try {
            firebase.initializeApp(config);

            this.db = firebase.firestore();
            this.auth = firebase.auth();

            this.messaging = firebase.messaging();
            this.messaging.usePublicVapidKey(
                keys.messagingPublicVapidKey || process.env.REACT_APP_MESSAGING_PUBLIC_VAPID_KEY
            );
            this.messaging.requestPermission()
                .then(this.getInstanceID)
                .catch((err) => {
                    console.log('Unable to get permission to notify.', err);
                });
          

            this.authenticated = false;

            // Listen for authentication state to change.
            this.auth.onAuthStateChanged((user) => {
                if (user != null) {
                    console.log("We are authenticated now!");
                    this.authenticated = true;
                }
            
                // Do other things
            });
        } catch (error) {
            console.log(error);
        }
    }

    getInstanceID() {
        console.log('Notification permission granted.');
                
        // Get Instance ID token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        this.messaging.getToken().then(function(refreshedToken) {
            console.log('Token refreshed.');
            // Indicate that the new Instance ID token has not yet been sent to the
            // app server.
            setTokenSentToServer(false);
            // Send Instance ID token to app server.
            sendTokenToServer(refreshedToken);
            
        }).catch(function(err) {
            console.log('Unable to retrieve refreshed token ', err);
            //showToken('Unable to retrieve refreshed token ', err);
        });

        // Callback fired if Instance ID token is updated.
        this.messaging.onTokenRefresh(function() {
                  
        });
    }

    registerOnMessageCallback(callback) {
        // Handle incoming messages. Called when:
        // - a message is received while the app has focus
        // - the user clicks on an app notification created by a service worker
        //   `messaging.setBackgroundMessageHandler` handler.
        this.messaging.onMessage(callback);
    }

    // *** Auth API ***
    isAuthenticated = () => {
        return this.authenticated;
    }

    createUser = async (email, password) => await this.auth.createUserWithEmailAndPassword(email, password);

    signIn = async (email, password) =>  await this.auth.signInWithEmailAndPassword(email, password);

    signOut = async () => await this.auth.signOut();

    resetPassword = async email => await this.auth.sendPasswordResetEmail(email);


    // *** User API ***
    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    //utility
    handleError = error => {
        console.log('Error', error);
    }

    notify = notice => {
        console.log('Hello', notice);
    }

}
  
  export default Firebase;