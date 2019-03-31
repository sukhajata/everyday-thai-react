import React from 'react';

import PhraseList from './PhraseList';

import { searchDb, toggleFavourite } from '../services/dbAccess';

class SearchResults extends React.Component {
  
  state = {
    phrases: [],
    input: '',
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.input !== prevState.input) { 
      const input = nextProps.match.params.input;
      const phrases = searchDb(input);
      
      return { 
        phrases,
        input,
      };
      
    }
    return null;
  }

  render() {
    const { phrases } = this.state;

    return (
      <React.Fragment>
        {phrases.length > 0 &&
          <PhraseList phrases={phrases}/>
        }
      </React.Fragment>
    );
  }

}

export default SearchResults;