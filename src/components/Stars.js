import React from 'reactn';

import styles from '../styles';
import { withStyles } from '@material-ui/core/styles';

import goldStar from '../img/ic_favourite_active.png';
import pinkStar from '../img/ic_star_pink.png';
import star from '../img/ic_favourite.png';

class Stars extends React.Component {
    
    render() {
        const { classes } = this.props;
        const { score } = this.global;
        
        return (
            <div className={classes.table}>
                {score && score.map((item,i) => (
                    <div className={classes.tableCell} key={i}>
                        {item === 0 && <img alt="" className={classes.tableCellImg} src={star}/>}
                        {item === 1 && <img alt="" className={classes.tableCellImg} src={goldStar}/>}
                        {item === -1 && <img alt="" className={classes.tableCellImg} src={pinkStar}/>}
                    </div>
                ))}
            </div>
        )
    }
}

export default withStyles(styles)(Stars);