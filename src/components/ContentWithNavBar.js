import React from 'react';

import NavBar from './NavBar';
import SideNav from './SideNav';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

class ContentWithNavBar extends React.Component {

    state = {
        sideOpen: false,
    }

    toggleDrawer = (open) => () => {
        this.setState({
          sideOpen: open,
        });
    }

    openDrawer = () => {
        this.setState({ sideOpen: true });
    }

    closeDrawer = () => {
        this.setState({ sideOpen: false });
    }

    render() {
        const { children, classes, location } = this.props;
        const { sideOpen } = this.state;

        let showSearchBox = false;
        if (location.pathname.indexOf('phrase-book') > 0 || 
            location.pathname.indexOf('search') > 0 ||
            location.pathname.indexOf('songs') > 0) {
            showSearchBox = true;
        }
        return (
            <React.Fragment>
                <SideNav 
                    sideOpen={sideOpen}
                    toggleDrawer={this.toggleDrawer}
                    closeDrawer={this.closeDrawer}
                />
                <NavBar 
                    toggleDrawer={this.toggleDrawer}
                    showSearchBox={showSearchBox}
                    {...this.props}
                />
                <div className={classes.content}>
                    {children}
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(ContentWithNavBar);