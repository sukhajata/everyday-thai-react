import React, { useGlobal } from 'reactn';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import styles from '../styles';
import { withStyles } from '@material-ui/core/styles';

const Totals = ({ classes, history, match }) => {
    
    const [ score, setScore ] = useGlobal('score');
    let result = '';
    if (!score) {
        history.push('/lessons/' + match.params.id);
    } else {
        result = score.filter(item => item === 1);
    }

    return (
        <div style={{ margin: 40, textAlign: 'center' }}>
            <Typography variant="h6">
                You did better than expected.
            </Typography>
            <Chip 
                className={classes.totals}
                label={result.length + " / " + score.length}
            />
            <Button
                className={classes.navigation}
                onClick={() => history.push('/lessons/')}
            >
            Continue
            </Button>
        </div>
    )
    
        
}

export default withStyles(styles)(Totals);