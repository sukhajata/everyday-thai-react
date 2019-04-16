import React from 'react';
import Firebase from './firebase';

const FirebaseContext = React.createContext(null);

const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
      {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  );

export default Firebase;

export { FirebaseContext, withFirebase };

