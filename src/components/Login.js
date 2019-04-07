import React from 'reactn';

import FacebookLogin from 'react-facebook-login';

const graphUrl = "https://graph.facebook.com/";
const facebookUrl = "https://facebook.com/";

class Login extends React.Component {

    facebookCallback = async (response) => {
        
        const { name, userID } = response;
        const result = await fetch(graphUrl + userID + '/picture?height=100');
        
        //1349793378493942
        const user = {
            name,
            facebookId: userID,
            thumbnailUrl: result.url,
        };
        this.setGlobal({
           user,
        });
        this.props.history.push("/signin/");
    }

    openProfile = () => {
        const names = this.state.name.split(" ");
        const link = names.join(".");
        this.props.history.push(facebookUrl + link);
    }

    render () {

        return (
            <div style={{ padding: 20}}>
                <FacebookLogin
                    appId="304315070251764"
                    autoLoad={true}
                    fields="name,picture"
                    onClick={this.componentClicked}
                    callback={this.facebookCallback} 
                />
            </div>
        )
    }
}

export default Login;