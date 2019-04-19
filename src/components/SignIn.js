import React from 'reactn';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getLanguage, addChatkitUser, setUserLocal } from '../services/dbAccess';
import settings from '../config/settings';
import { withFirebase } from '../firebase';
import styles from '../styles';
import Loading from './Loading';
import Error from './Error';

class SignIn extends React.Component {

    state = {
        name: '',
        age: '',
        country: '',
        province: '',
        gender: '',
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
            console.log(details);
            if (details) {
                this.setState({
                    name: details.name ? details.name : '',
                    age: details.age ? details.age : '',
                    country: details.country ? details.country : '',
                    province: details.province ? details.province : '',
                })
            }
        }
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    onFormSubmit = async () => {
        const { name, age, gender, country, province } = this.state;
        const { firebase } = this.props;
        const user = firebase.auth.currentUser;
        if (user) {
            this.setState({
                loading: true,
            });
            const data = {
                name,
                age,
                gender,
                country,
                province,
                firstLanguage: settings.firstLanguage,
            };
            await firebase.addUserDetails(user.uid, data);
            await addChatkitUser(user.uid, name);
            setUserLocal({
                id: user.uid,
                ...data
            })
            this.props.history.push('/interests/');
        }   
    }

    render() {
        const { classes } = this.props;
        const { loading, error, name, email, province, country, age, gender } = this.state;
        const language = getLanguage();
        const isValid =   name.length > 1 && 
        age.length > 0 && 
        gender.length > 0 &&
        (country.length > 1 || province.length > 1)

        if (loading) return <Loading />

        if (error) return <Error message={error} />

        return (
            <React.Fragment>
                <Typography variant="body1" style={{ margin: 20, marginTop: 80 }}>
                    {language.shareDetails}
                </Typography>
                <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="name"
                    label={language.name}
                    required
                    value={name}
                    className={classes.textField}
                    margin="normal"
                    placeholder={language.name}
                    onChange={this.handleChange('name')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                {settings.firstLanguage === 'th' &&
                <TextField
                    id="province"
                    label="จังหวัด"
                    required
                    value={province}
                    className={classes.textField}
                    fullWidth
                    margin="normal"
                    placeholder="จังหวัด"
                    onChange={this.handleChange('province')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                }
                {settings.firstLanguage === 'en' &&
                <TextField
                    id="country"
                    label={language.country}
                    required
                    value={country}
                    className={classes.textField}
                    fullWidth
                    margin="normal"
                    placeholder={language.country}
                    onChange={this.handleChange('country')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                }
                <TextField
                    id="age"
                    label={language.age}
                    placeholder={language.age}
                    value={age}
                    className={classes.textField}
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={this.handleChange('age')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <FormControl component="fieldset" className={classes.formControl}>
                    <RadioGroup
                        aria-label="Gender"
                        name="gender"
                        className={classes.group}
                        onChange={this.handleChange('gender')}
                    >
                        <FormControlLabel value="Female" control={<Radio />} label={language.female} />
                        <FormControlLabel value="Male" control={<Radio />} label={language.male} />
                    </RadioGroup>
                </FormControl>
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
   
const fired = withFirebase(SignIn);
export default withStyles(styles)(fired);