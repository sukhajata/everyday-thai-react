import React from 'reactn';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { getLanguage, translate } from '../services/dbAccess';
import settings from '../config/settings';
import { withFirebase } from '../firebase';
import styles from '../styles';
import Loading from './Loading';
import Error from './Error';

const english = settings.firstLanguage === 'en';
let typingTimer = null;

class Interests extends React.Component {

    state = {
        firstLanguage: '',
        secondLanguage: '',
        labelWidth: 0,
        loading: false,
        error: null,
    }

    componentDidMount() {
        this.props.firebase.registerAuthenticationStateChangedListener(this.onAuthenticationStateChanged);
    }

    onAuthenticationStateChanged = async (user) => {
        if(user != null) {
            const details = await this.props.firebase.getUserDetails(user.uid);
            if (details.interestsEnglish) {
                this.setState({
                    firstLanguage: english ? details.interestsEnglish : details.interestsThai,
                    secondLanguage: english ? details.interestsThai : details.interestsEnglish,
                })
            }
        }
    }

    handleChange = name => async event => {
        const text = event.target.value;
        this.setState({ [name]: text });

        if (name === 'firstLanguage') {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(this.translateText, 1000);
        }
    };

    translateText = async () => {
        const text = this.state.firstLanguage;
        const translated = await translate(text, english ? 'th' : 'en');
        this.setState({
            secondLanguage: translated,
        })
    }

    onFormSubmit = async () => {
        const { firebase } = this.props;
        const { firstLanguage, secondLanguage } = this.state;
        const user = firebase.auth.currentUser;
        if (user) {
            this.setState({
                loading: true,
            });
            const data = {
                interestsEnglish: english ? firstLanguage : secondLanguage,
                interestsThai: english ? secondLanguage : firstLanguage, 
            };
            await firebase.addUserInterests(user.uid, data);
            this.props.history.push('/partners/');
        }   
    }

    render() {
        const { classes } = this.props;
        const { loading, error, firstLanguage, secondLanguage } = this.state;
        const language = getLanguage();
        const isValid =  firstLanguage.length > 10 || secondLanguage.length > 10;

        if (loading) return <Loading />

        if (error) return <Error message={error} />

        return (
            <React.Fragment>
                <Typography variant="body1" style={{ margin: 20, marginTop: 80 }}>
                    {language.shareInterests}
                </Typography>
                <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="firstLanguage"
                    label={english ? 'EN' : 'ไทย'}
                    required
                    multiline
                    variant="outlined"
                    rowsMax="4"
                    value={firstLanguage}
                    className={classes.textField}
                    fullWidth
                    margin="normal"
                    placeholder={english ? 'EN' : 'ไทย'}
                    onChange={this.handleChange('firstLanguage')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                
                <TextField
                    id="secondLanguage"
                    label={english ? 'ไทย' : 'EN'}
                    required
                    multiline
                    variant="outlined"
                    rowsMax="4"
                    value={secondLanguage}
                    className={classes.textField}
                    fullWidth
                    margin="normal"
                    placeholder={english ? 'ไทย' : 'EN'}
                    onChange={this.handleChange('secondLanguage')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                </form>
                <div>
                    <Button 
                        onClick={this.onFormSubmit}
                        variant="contained"
                        disabled={!isValid}
                        color="primary"
                        style={{ margin: 8 }}
                    >
                        {language.continue}
                    </Button>
                </div>
            
            </React.Fragment>
        )
    }
}
   
const fired = withFirebase(Interests);
export default withStyles(styles)(fired);