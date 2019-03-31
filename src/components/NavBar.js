import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import styles from '../styles';

class NavBar extends React.Component { 
    
    handleKeyUp = (event) => {
        if (event.key === 'Enter') {
            this.props.history.push('/search/' + event.target.value);
        }
    }

    render () {
        const { classes, toggleDrawer, showSearchBox } = this.props;
        return (
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton className={classes.menuButton} onClick={toggleDrawer(true)} color="inherit" aria-label="Open drawer">
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                        Everyday Thai
                    </Typography>
                    {showSearchBox &&
                        <React.Fragment>
                            <div className={classes.grow} />
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search…"
                                    onKeyUp={this.handleKeyUp}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                />
                            </div>
                        </React.Fragment>
                    }
                   
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles)(NavBar);