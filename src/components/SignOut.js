import React, { useEffect, useState } from 'react';
import { withFirebase } from '../firebase';
import { Redirect } from 'react-router-dom';

const SignOut = ({ firebase }) => {
    const [ loggedOut, setLoggedOut ] = useState(false);

    useEffect(() => {
        async function logout() {
            await firebase.signOut();
            setLoggedOut(true);
        }
        
        logout();
    }, []);

    return (
        <>
        {loggedOut &&
            <Redirect to="/login" />
        }
        </>
    )
}

export default withFirebase(SignOut);