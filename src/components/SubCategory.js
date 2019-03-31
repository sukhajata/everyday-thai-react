import React from 'react';

import { getSubCategory, toggleFavourite } from '../services/dbAccess';

import PhraseList from './PhraseList';

class SubCategory extends React.Component {
  
  state = {
    phrases: [],
  }

  componentDidMount = () => {
    const phrases = getSubCategory(this.props.match.params.id);
    this.setState({ phrases });
  }

  render() {
    const { phrases } = this.state;

    return (
      <React.Fragment>
        {phrases &&
          <PhraseList  
            phrases={phrases} 
          />
        }
      </React.Fragment>
    );
  }

}

export default SubCategory;