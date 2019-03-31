import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Translate from '@material-ui/icons/Translate';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import ImportContacts from '@material-ui/icons/ImportContacts';
import LibraryMusic from '@material-ui/icons/LibraryMusic';
import Favorite from '@material-ui/icons/Favorite';

import logo from '../img/icon-promo.jpg';

import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';


const Home = ({ classes }) => {

    return (
        <List>
            <ListItem button className={classes.listMenuItem} >
                <ListItemIcon><Translate color="primary"/></ListItemIcon>
                <Link className={classes.listLink} to="/phrase-book/">
                    <ListItemText primary="Phrase Book"/> 
                </Link>
            </ListItem>
            <Divider/>
            <ListItem button className={classes.listMenuItem} >
                <ListItemIcon><ImportContacts color="primary"/></ListItemIcon>
                <Link className={classes.listLink} to="/lessons/">
                    <ListItemText primary="Lessons"/>
                </Link>
            </ListItem>
            <Divider/>
            <ListItem button className={classes.listMenuItem} >
                <ListItemIcon><LibraryMusic color="primary"/></ListItemIcon>
                <Link className={classes.listLink} to="/songs/">
                    <ListItemText primary="Songs"/> 
                </Link>
            </ListItem>
            <Divider/>
            <ListItem button className={classes.listMenuItem} >
                <ListItemIcon><Favorite color="error"/></ListItemIcon>
                <Link className={classes.listLink} to="/favourites/">
                    <ListItemText primary="Favourites"/> 
                </Link>
            </ListItem>
    
        </List>
    )
}

export default withStyles(styles)(Home);