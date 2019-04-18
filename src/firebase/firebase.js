import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
//import 'firebase/messaging';
import keys from '../config/keys';
import { setTokenSentToServer, sendTokenToServer } from './messaging';
import settings from '../config/settings';

const config = {
  apiKey: keys.apiKey ,
  authDomain: keys.authDomain,
  databaseURL: keys.databaseURL,
  projectId: keys.projectId,
  storageBucket: keys.storageBucket,
  messagingSenderId: keys.messagingSenderId,
};

const COLLECTION_ROOMS = "rooms";
const COLLECTION_USERS = "users";
const english = settings.firstLanguage === 'en';

class Firebase {
    constructor() {
        try {
            firebase.initializeApp(config);

            this.db = firebase.firestore();
            this.auth = firebase.auth();
            /*this.messaging = firebase.messaging();
            this.messaging.usePublicVapidKey(
                keys.messagingPublicVapidKey || process.env.REACT_APP_MESSAGING_PUBLIC_VAPID_KEY
            );
            this.messaging.requestPermission()
                .then(this.getInstanceID)
                .catch((err) => {
                    console.log('Unable to get permission to notify.', err);
                });
            */

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

    addRoom = async (englishUserId, thaiUserId, roomId) => {
        const result = await this.db.collection(COLLECTION_ROOMS).doc(roomId).set({
            englishUserId,
            englishPeerId: "0",
            thaiUserId,
            thaiPeerId: "0",
            roomId
        });
        return result;
    }

    getRoom = async (englishUserId, thaiUserId) => {
        const room = await this.db.collection(COLLECTION_ROOMS)
            .where("englishUserId", "==", englishUserId.toString())
            .where("thaiUserId", "==", thaiUserId.toString())
            .get();
        return room;
    }

    deleteRoom = (id) => {
        this.db.collection(COLLECTION_ROOMS).doc(id.toString()).delete();
    }

    setPeerId(id, peerId) {
        if (english) {
            this.db.collection(COLLECTION_ROOMS).doc(id.toString()).update({
                englishPeerId: peerId, 
            })
        } else {
            this.db.collection(COLLECTION_ROOMS).doc(id.toString()).update({
                thaiPeerId: peerId, 
            })
        }
    }

    getPartnerPeerId = async (roomId) => {
        const doc = await this.db.collection(COLLECTION_ROOMS).doc(roomId).get();
        if (doc.exists) {
            const data = doc.data();
            const partnerPeerId = english ? data.thaiPeerId : data.englishPeerId;
            return partnerPeerId;
        } else {
            return false;
        }
    }

    registerOnRoomChangedCallback(id, callback) {
        this.db.collection(COLLECTION_ROOMS).doc(id).onSnapshot(callback);
    }

    registerOnMessageCallback(callback) {
        // Handle incoming messages. Called when:
        // - a message is received while the app has focus
        // - the user clicks on an app notification created by a service worker
        //   `messaging.setBackgroundMessageHandler` handler.
        this.messaging.onMessage(callback);
    }

    // *** Auth API ***
    registerAuthenticationStateChangedListener = (listener) => {
        this.auth.onAuthStateChanged((user) => listener(user));            
    }

    createUser = async (email, password) => await this.auth.createUserWithEmailAndPassword(email, password);

    signIn = async (email, password) =>  await this.auth.signInWithEmailAndPassword(email, password);

    signOut = async () => await this.auth.signOut();

    resetPassword = async email => await this.auth.sendPasswordResetEmail(email);

    //*** users */
    getFirebaseUser = () => this.auth.currentUser;

    getUserDetails = async (uid) => {
        const doc = await this.db.collection(COLLECTION_USERS).doc(uid).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    }

    addUserDetails = async(uid, data) => {
        try {
            const result = await this.db.collection(COLLECTION_USERS).doc(uid).set(data);
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    addUserInterests = async(uid, data) => {
        try {
            const result = await this.db.collection(COLLECTION_USERS).doc(uid).update(data);
            return result;
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    getPartners = async() => {
        try {
            const snapshot = await this.db.collection(COLLECTION_USERS)
                .where('firstLanguage', '==', english ? 'th': 'en')
                .get();
            const items = snapshot.docs.map(item => {
                return {
                    id: item.id,
                    ...item.data()
                }
            });
            /*snapshot.forEach(item => {
                items.push({
                    id: item.id,
                    ...item.data(),
                });
            })*/
            return items;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    //utility
    handleError = error => {
        console.log('Error', error);
    }

    notify = notice => {
        console.log('Hello', notice);
    }

}
  
  export default Firebase;