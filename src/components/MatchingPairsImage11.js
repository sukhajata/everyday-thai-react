import React from 'react';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import { shuffle } from '../services/helpers';
import { textToSpeechEnglish, textToSpeechThai } from '../services/dbAccess';
import settings from '../config/settings';

class MatchingPairsImage11 extends React.Component {

    state = {
        selectedImage: null,
        selectedText: null,
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

    selectImage = index => {
        const { selectedText, matched } = this.state;
        const { correctCard, correctCardFade, wrongCard, defaultCard } = this.props.classes;
        let cards = this.state.cards.splice(0);
        if (selectedText) {
            if (selectedText === cards[index].id) {
                //fade out the matching pair
                cards = cards.map((card, idx) => {
                    if(card.id === selectedText || idx === index) {
                        card.className = correctCardFade;
                    } 
                    return card;
                });

                this.setState({
                    selectedImage: null,
                    selectedText: null,
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
                selectedImage: cards[index].id,
                cards,
            });
        }
    }

    selectText = index => {
        const { selectedImage, matched } = this.state;
        const { correctCard, correctCardFade, wrongCard, defaultCard } = this.props.classes;
        let cards = this.state.cards.splice(0);
        if (settings.firstLanguage === 'en') {
            textToSpeechThai(cards[index].thai);
        } else {
            textToSpeechEnglish(cards[index].english);
        }
        if (selectedImage) {
            if (selectedImage === cards[index].id) {
                cards = cards.map((card, idx) => {
                    if(card.id === selectedImage || idx === index) {
                        card.className = correctCardFade;
                    } 
                    return card;
                });

                this.setState({
                    selectedImage: null,
                    selectedText: null,
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
                selectedText: cards[index].id,
                cards,
            })
        }
    }

    render() {
        const { cards } = this.state;
        const { imageUrl, classes } = this.props;

        return (
            <React.Fragment>
                {cards && 
                <React.Fragment>
                    <Card 
                        key="1"
                        className={cards[0].className}
                        onClick={() => this.selectText(0)}
                    >
                        <CardContent>
                             <Typography variant="body1" >
                                {cards[0].english}<br/>
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card 
                        key="2"
                        className={cards[1].className}
                        onClick={() => this.selectText(1)}
                    >
                        <CardContent>
                            <Typography variant="body1" >
                                {cards[1].english}<br/>
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card 
                        key="3"
                        className={cards[2].className}
                        onClick={() => this.selectImage(2)}
                    >
                        <CardContent>
                            <img 
                                alt="" 
                                className={classes.imageFit}  
                                src={imageUrl + cards[2].imageFileName}
                            /> 
                        </CardContent>
                    </Card>
                    <Card 
                        key="4"
                        className={cards[3].className}
                        onClick={() => this.selectImage(3)}
                    >
                        <CardContent>
                            <img 
                                alt="" 
                                className={classes.imageFit}  
                                src={imageUrl + cards[3].imageFileName}
                            /> 
                        </CardContent>
                    </Card>
                </React.Fragment>
                }
            </React.Fragment>
        )

    }
}

export default withStyles(styles)(MatchingPairsImage11);