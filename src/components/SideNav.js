import React from 'react';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import logo from '../img/icon-promo.jpg';

import Menu from './Menu';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

class SideNav extends React.Component { 
    
    handleClick = () => {
        this.props.closeDrawer();
    }

    render() {
        const { classes, sideOpen, toggleDrawer } = this.props;

        return  (
            <SwipeableDrawer
                open={sideOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            > 
                <div
                    tabIndex={0}
                    role="button"
                >
                    <Grid container className={classes.header}>
                        <Grid item >
                        <img alt="logo" src={logo} height="30" />
                        </Grid>
                        <Grid item>
                        <Typography  component="h1" variant="h6" className={classes.headerText}>
                            Everyday Thai
                        </Typography>
                        </Grid>
                    </Grid>
                    <Divider/>
                    <Menu handleClick={this.handleClick}/>
                </div>
        </SwipeableDrawer>
        
        )
    }
}

export default withStyles(styles)(SideNav);