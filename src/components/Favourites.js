import React from 'react';

import { getFavourites, toggleFavourite } from '../services/dbAccess';

import PhraseList from './PhraseList';

class SubCategory extends React.Component {
  
  state = {
    phrases: [],
  }

  componentDidMount = () => {
    const phrases = getFavourites();
    this.setState({ phrases });
  }

  handleClickToggleFavourite = (id) => {
    //update database and get result
    const isFavourite = toggleFavourite(id);
    //update UI
    let phrases = this.state.phrases.map(phrase => {
        if (phrase.pid === id) {
            phrase.isFavourite = isFavourite;
        }
        return phrase;
    });
    this.setState({ phrases });

  }

  render() {
    const { phrases } = this.state;

    return (
        <PhraseList phrases={phrases} handleClickToggleFavourite={this.handleClickToggleFavourite}/>
    );
  }

}

export default SubCategory;