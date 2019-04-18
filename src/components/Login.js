import React, { useEffect } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { withFirebase } from '../firebase';


// Configure FirebaseUI.
const uiConfig = {
    // signin or redirect flow.
    signInFlow: 'redirect',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/signin/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false
      },
    ]
  };

const Login = ({ firebase, history }) => {

    useEffect(() => {
        firebase.registerAuthenticationStateChangedListener((user) => {
            if (user != null) {
                history.push('/signin');
            }
        })
    });

    return (
        <StyledFirebaseAuth 
            uiConfig={uiConfig} 
            firebaseAuth={firebase.auth}
        />        
    );
}
   

export default withFirebase(Login);