import React from 'react';

import FacebookLogin from 'react-facebook-login';

import { getUser } from '../services/dbAccess';

import { Redirect } from 'react-router-dom';

class Login extends React.Component {

    state = {
        name: null,
        facebookId: null,
    }

    facebookCallback = async ({ name, userID }) => {
        this.setState({ 
            name, 
            facebookId: userID,
        });
    }


    render () {
        const { name, facebookId } = this.state;
        return (
            <div style={{ padding: 20}}>
                <FacebookLogin
                    appId="304315070251764"
                    autoLoad={true}
                    fields="name,picture"
                    callback={this.facebookCallback} 
                />
                {facebookId &&
                    <Redirect to={"/signin/" + facebookId + "/" + name} />
                }
            </div>
        )
    }
}

export default Login;