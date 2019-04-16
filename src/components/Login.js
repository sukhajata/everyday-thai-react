import React from 'reactn';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { FirebaseContext } from '../firebase';


// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'redirect',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/partners/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ]
  };

const Login = () => {
    return (
        <FirebaseContext.Consumer>
            {firebase => 
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth}/>
            }
        </FirebaseContext.Consumer>
    );
}
   
export default Login;