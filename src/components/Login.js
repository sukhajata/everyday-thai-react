import React from 'reactn';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import FacebookLogin from 'react-facebook-login';

const graphUrl = "https://graph.facebook.com/";
const facebookUrl = "https://facebook.com/";

class Login extends React.Component {

    state = {
        name: '',
        thumbnailUrl: null,
        largeUrl: null,
        userID: null,
    }

    componentClicked = () => {

    }

    facebookCallback = async (response) => {
        
        const { name, accessToken, userID } = response;
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

    showPicture = async () => {
        const { clientWidth } = document.documentElement;
        const result = await fetch(graphUrl + this.state.userID + '/picture?width=' + (clientWidth - 50));
        this.setState({ 
            largeUrl: result.url,
         })
    }

    hidePicture = () => {
        this.setState({
            largeUrl: null,
        })
    }

    openProfile = () => {
        const names = this.state.name.split(" ");
        const link = names.join(".");
        this.props.history.push(facebookUrl + link);
    }

    render () {
        const { name, thumbnailUrl, largeUrl } = this.state;

        return (
            <div style={{ position: 'relative' }}>
            {thumbnailUrl &&
                <Card style={{ margin: 20 }}>
                    <CardContent>
                        <Grid container spacing={16} >
                            <Grid item>
                                <img src={thumbnailUrl} alt="profile" onClick={this.showPicture}/>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" onClick={this.openProfile}>
                                    {name}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            }
            <div style={{ padding: 20}}>
                <FacebookLogin
                    appId="304315070251764"
                    autoLoad={true}
                    fields="name,picture"
                    onClick={this.componentClicked}
                    callback={this.facebookCallback} 
                />
            </div>
            {largeUrl &&
                <div style={{ position: 'absolute', top: 25, left: 20 }}>
                    <img src={largeUrl} alt="hello" onClick={this.hidePicture}/>
                </div>
            }
            </div>
        )
    }
}

export default Login;