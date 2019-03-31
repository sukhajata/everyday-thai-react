import React from 'react';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import { shuffle } from '../services/helpers';

class MatchingPairsText6 extends React.Component {

    state = {
        selectedEnglish: null,
        selectedThai: null,
        matched: 0,
        result: 0,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.slide.id !== prevState.slideId) {
            let cards = [];
            nextProps.slide.medias.forEach(media => {
                cards.push({
                    ...media,
                    className: nextProps.classes.defaultCard,
                })
            });
            
            shuffle(nextProps.slide.medias).forEach(media => {
                cards.push({
                    ...media,
                    className: nextProps.classes.defaultCard,
                });
            });
            
            return {
                cards,
                matched: 0,
                result: 0,
                slideId: nextProps.slide.id,
            }
        } else {
            return null;
        }
    }

    finishUp = () => {
        const result = this.state.result === -1 ? -1 : 1;
        this.props.moveNextSlide(result);    
        
    }

    selectEnglish = index => {
        const { selectedThai, matched } = this.state;
        const { correctCard, correctCardFade, wrongCard, defaultCard } = this.props.classes;
        let cards = this.state.cards.splice(0);
        if (selectedThai) {
            if (selectedThai === cards[index].id) {
                //fade out the matching pair
                cards = cards.map((card, idx) => {
                    if(card.id === selectedThai || idx === index) {
                        card.className = correctCardFade;
                    } 
                    return card;
                });

                this.setState({
                    selectedEnglish: null,
                    selectedThai: null,
                    cards,
                });

                if (matched === 1) {
                    setTimeout(() => this.finishUp(), 200);
                } else {
                    this.setState({ matched: 1 });
                }

            } else {
                //show wrong colour then fade out
                cards[index].className = wrongCard;
                this.setState({
                    cards,
                    result: -1,
                });
                setTimeout(() => {
                    cards[index].className = defaultCard;
                    this.setState({
                        cards,
                    })
                }, 300);
                
            }
            
        } else {
            cards[index].className = correctCard;
            if (index === 2 && cards[3].className === correctCard) {
                cards[3].className = defaultCard;
            } else if (index === 3 && cards[2].className === correctCard) {
                cards[2].className = defaultCard;
            }
            this.setState({
                selectedEnglish: cards[index].id,
                cards,
            });
        }
    }

    selectThai = index => {
        const { selectedEnglish, matched } = this.state;
        const { correctCard, correctCardFade, wrongCard, defaultCard } = this.props.classes;
        let cards = this.state.cards.splice(0);
        if (selectedEnglish) {
            if (selectedEnglish === cards[index].id) {
                cards = cards.map((card, idx) => {
                    if(card.id === selectedEnglish || idx === index) {
                        card.className = correctCardFade;
                    } 
                    return card;
                });

                this.setState({
                    selectedEnglish: null,
                    selectedThai: null,
                    cards,
                });

                if (matched === 1) {
                    setTimeout(() => this.finishUp(), 200);
                } else {
                    this.setState({ matched: 1 });
                }
            } else {
                 //show wrong colour then fade out
                 cards[index].className = wrongCard;
                 this.setState({
                     cards,
                     result: -1,
                 });
 
                 setTimeout(() => {
                    cards[index].className = defaultCard;
                    this.setState({
                        cards,
                    })
                }, 300);
            }
          
        } else {
            cards[index].className = correctCard;
            if (index === 0 && cards[1].className === correctCard) {
                cards[1].className = defaultCard;
            } else if (index === 1 && cards[0].className === correctCard) {
                cards[0].className = defaultCard;
            }
            this.setState({
                selectedThai: cards[index].id,
                cards,
            })
        }
    }

    render() {
        const { cards } = this.state;

        return (
            <React.Fragment>
                {cards && 
                <React.Fragment>
                    <Card 
                        key="1"
                        className={cards[0].className}
                        onClick={() => this.selectThai(0)}
                    >
                        <CardContent>
                            <Typography variant="body1" >
                                {cards[0].thai}<br/>
                                {cards[0].phonetic}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card 
                        key="2"
                        className={cards[1].className}
                        onClick={() => this.selectThai(1)}
                    >
                        <CardContent>
                            <Typography variant="body1" >
                                {cards[1].thai}<br/>
                                {cards[1].phonetic}
                            </Typography>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        key="3"
                        className={cards[2].className}
                        onClick={() => this.selectEnglish(2)}
                    >
                        <CardContent>
                            <Typography variant="body1" >
                                {cards[2].english}<br/>
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card 
                        key="4"
                        className={cards[3].className}
                        onClick={() => this.selectEnglish(3)}
                    >
                        <CardContent>
                            <Typography variant="body1" >
                                {cards[3].english}<br/>
                            </Typography>
                        </CardContent>
                    </Card>
                </React.Fragment>
                }
            </React.Fragment>
        )

    }
}

export default withStyles(styles)(MatchingPairsText6);