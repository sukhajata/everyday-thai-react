import React from 'reactn';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { signUp } from '../services/dbAccess';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getLanguage, setUser } from '../services/dbAccess';

import styles from '../styles';

import Loading from './Loading';
/*const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',SVGLinearGradientElement,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  menu: {
    width: 200,
  },
});
*/
class SignIn extends React.Component {
    state = {
        name: '',
        age: '',
        country: '',
        gender: '',
        labelWidth: 0,
        loading: false,
        error: null,
    };

    componentDidMount = () => {
        const { user } = this.global;
        if (!user) {
            this.props.history.push('/login/');
        } else {
            this.setState({
                name: user.name,
            })
        }
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    onFormSubmit = async () => {
        const { name, age, gender, country } = this.state;
        if (name.length > 1 && country.length > 1 && age.length > 0) {
            this.setState({
                loading: true,
            });
            const data = {
                name,
                age,
                gender,
                country,
                facebookId: this.global.user.facebookId,
            };
            const result = await signUp(data);

            if (!result) {
                this.setState({
                    loading: false,
                });
            } else {
                const user = {
                    ...this.global.user,
                    id: result.id,
                    age,
                    gender,
                    country,
                };
                setUser(user);
                this.setGlobal({ user });
                this.props.history.push('/partners/');
            }
           
        }   
    }
    
    render() {
        const { classes } = this.props;
        const { name, age, country, loading } = this.state;
        const language = getLanguage(this.global.code);

        if (loading) return <Loading />

        return (
        <React.Fragment>
            <Typography variant="body1" style={{ margin: 20, marginTop: 80 }}>
                Please share a few details.
            </Typography>
            <form className={classes.container} noValidate autoComplete="off">
            <TextField
                id="name"
                label={language.name}
                required
                value={name}
                className={classes.textField}
                margin="normal"
                placeholder="Name"
                onChange={this.handleChange('name')}
                InputLabelProps={{
                shrink: true,
                }}
            />
            
            <TextField
                id="country"
                label={language.country}
                required
                value={country}
                className={classes.textField}
                fullWidth
                margin="normal"
                placeholder="Country"
                onChange={this.handleChange('country')}
                InputLabelProps={{
                shrink: true,
                }}
            />

            <TextField
                id="age"
                label={language.age}
                placeholder="Age"
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
            <div><Button 
                onClick={this.onFormSubmit}
                variant="contained"
                color="primary"
                style={{ margin: 8 }}
            >
                {language.continue}
            </Button>
            </div>
            
        
        </React.Fragment>
        );
    }
}



export default withStyles(styles)(SignIn);