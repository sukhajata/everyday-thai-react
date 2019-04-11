import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';

import Translate from '@material-ui/icons/Translate';
import ImportContacts from '@material-ui/icons/ImportContacts';
import LibraryMusic from '@material-ui/icons/LibraryMusic';
import Favorite from '@material-ui/icons/Favorite';
import Forum from '@material-ui/icons/Forum';

import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import { getLanguage } from '../services/dbAccess';

const Menu = ({ classes, handleClick }) => {
    const language = getLanguage();

    return (
        <div className={classes.list}>
        <List>
            <ListItem button className={classes.listMenuItem} onClick={handleClick}>
                <ListItemIcon><Translate color="primary"/></ListItemIcon>
                <Link className={classes.listLink} to="/phrase-book/">
                    <ListItemText primary={language.phraseBook}/> 
                </Link>
            </ListItem>
            <Divider/>
            <ListItem button className={classes.listMenuItem} onClick={handleClick}>
                <ListItemIcon><ImportContacts color="primary"/></ListItemIcon>
                <Link className={classes.listLink} to="/lessons/">
                    <ListItemText primary={language.lessons}/>
                </Link>
            </ListItem>
            <Divider/>
            <ListItem button className={classes.listMenuItem} onClick={handleClick}>
                <ListItemIcon><LibraryMusic color="primary"/></ListItemIcon>
                <Link className={classes.listLink} to="/songs/">
                    <ListItemText primary={language.songs}/> 
                </Link>
            </ListItem>
            <Divider/>
            <ListItem button className={classes.listMenuItem} onClick={handleClick}>
                <ListItemIcon><Favorite color="error"/></ListItemIcon>
                <Link className={classes.listLink} to="/favourites/">
                    <ListItemText primary={language.favourites}/> 
                </Link>
            </ListItem>
            <Divider/>
            <ListItem button className={classes.listMenuItem} onClick={handleClick}>
                <ListItemIcon><Forum color="primary"/></ListItemIcon>
                <Link className={classes.listLink} to="/partners/">
                    <ListItemText primary={language.languagePartner}/> 
                </Link>
            </ListItem>
    
        </List>
    </div>
    )
}

export default withStyles(styles)(Menu);