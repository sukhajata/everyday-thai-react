import React from 'reactn';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getLanguage, signUp, setUser, getUser } from '../services/dbAccess';
import settings from '../config/settings';

import styles from '../styles';

import Loading from './Loading';
import Error from './Error';

class SignIn extends React.Component {

    state = {
        name: '',
        email: '',
        age: '',
        country: '',
        province: '',
        gender: '',
        labelWidth: 0,
        loading: false,
        error: null,
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    onFormSubmit = async () => {
        const { name, age, email, gender, country, province } = this.state;
        if (name.length > 1 && age.length > 0) {
            this.setState({
                loading: true,
            });
            const data = {
                name,
                age,
                email,
                gender,
                country,
                province,
                firstLanguage: settings.firstLanguage,
            };
            const result = await signUp(data);

            if (!result) {
                this.setState({
                    loading: false,
                });
            } else {
                const user = {
                    ...data,
                    id: result.id,
                };
                setUser(user);
                this.props.history.push('/partners/');
            }
           
        }   
    }

    render() {
        const { classes } = this.props;
        const { loading, error, name, email, province, country, age } = this.state;
        const language = getLanguage();

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
                 <TextField
                    id="email"
                    label={language.email}
                    required
                    value={email}
                    className={classes.textField}
                    margin="normal"
                    placeholder={language.email}
                    onChange={this.handleChange('email')}
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
                    onChange={this.handleChange('country')}
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
   

export default withStyles(styles)(SignIn);