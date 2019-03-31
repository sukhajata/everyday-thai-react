import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

import { BrowserRouter, Route, Switch } from "react-router-dom";

import 'typeface-roboto';

import './App.css';
import { dbSetup } from './services/dbAccess';
import PhraseBookMenu from './components/PhraseBookMenu';
import SubCategory from './components/SubCategory';
import LessonIndex from './components/LessonIndex';
import Lesson from './components/Lesson';
import SongIndex from './components/SongIndex';
import ContentWithNavBar from './components/ContentWithNavBar';
import SearchResults from './components/SearchResults';
import Favourites from './components/Favourites';
import Totals from './components/Totals';
import Home from './components/Home';
import PhraseList from './components/PhraseList';

import theme from './theme';
import styles from './styles';

class App extends Component {

  async componentDidMount() {
    await dbSetup();
}

  render() {
    const { classes } =this.props;
    return (
        <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
              <Route 
                exact path="/"
                render={ props =>
                  <ContentWithNavBar {...props}>
                    <Home {...props} />
                  </ContentWithNavBar>
                }
              />
              <Route
                exact path="/phrase-book/"
                render={ props => 
                  <ContentWithNavBar {...props}>
                    <PhraseBookMenu {...props} />
                  </ContentWithNavBar>
                }
              />
              <Route
                path="/phrase-book/:id"
                render={ props => 
                  <ContentWithNavBar {...props}>
                    <SubCategory {...props} />
                  </ContentWithNavBar>
                }
              />
              <Route
                path="/search/:input"
                render={ props => 
                  <ContentWithNavBar {...props}>
                    <SearchResults {...props}/>
                  </ContentWithNavBar>
                }
              />
              <Route
                exact path="/songs/"
                render={ props => 
                  <ContentWithNavBar {...props}>
                    <SongIndex
                      {...props}
                    />
                  </ContentWithNavBar>
                }
              />
              <Route
                path="/songs/:id"
                render={ props => 
                  <ContentWithNavBar {...props}>
                    <SubCategory {...props} />
                  </ContentWithNavBar>
                }
              />
              <Route
                exact path="/lessons/"
                render={ props => 
                  <ContentWithNavBar {...props}>
                    <LessonIndex 
                      {...props}
                    />
                  </ContentWithNavBar>
                }
              />
              <Route 
                path="/lessons/:id"
                render={ props =>
                  <div className={classes.lessonContent}>
                    <Lesson 
                      {...props}
                    />
                  </div>
                }
              />
              <Route
                path="/favourites/"
                render={ props => 
                  <ContentWithNavBar {...props}>
                    <Favourites {...props}/>
                  </ContentWithNavBar>  
                }
              />
              <Route
                path="/totals/:id/"
                render={ props =>
                  <Totals {...props} />
                }
              />
            </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
