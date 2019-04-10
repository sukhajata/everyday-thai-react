import React from 'react';

import TextOption from './TextOption';
import AudioPrompt from './AudioPrompt';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import { shuffle } from '../services/helpers';
import settings from '../config/settings';

class MultiChoiceSlide extends React.Component { 

    state = {
        cards: [],
        slideId: 0,
        result: 0,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.slide.id !== prevState.slideId) {
            const cards = shuffle(nextProps.slide.medias).map(media => {
                return {
                    ...media, 
                    className: nextProps.classes.defaultCard
                }
            });
           
            return {
                cards,
                slideId: nextProps.slide.id,
                result: 0,
            }
        } else {
            return null;
        }
    }

    selectCorrect = id => {
        const cards = this.state.cards.map(card => {
            if (card.id == id) {
                card.className = this.props.classes.correctCard;
            }
            return card;
        });
        
        this.setState({ cards });
        setTimeout(() => {
            const result = this.state.result === -1 ? -1 : 1;
            this.props.moveNextSlide(result);
        }, 400);
    }

    selectWrong = id => {
        const cards = this.state.cards.map(card => {
            if (card.id == id) {
                card.className = this.props.classes.wrongCard;
            }
            return card;
        });

        this.setState({ 
            cards,
            result: -1, 
        });
    }

    render() {
        const { slide, labelUpper, labelLower, extra, upperText, lowerText } = this.props;
        const { cards } = this.state;

        return (
            <React.Fragment>
                {slide && cards &&
                <React.Fragment>
                    <AudioPrompt 
                        audioFileName={slide.audioFileName}
                        textToSpeak={labelUpper}
                        instructions={slide.instructions}
                        labelUpper={labelUpper}
                        labelLower={labelLower}
                        extra={extra}
                    />
                    {cards.map(media => (
                    <TextOption
                        key={media.id}
                        media={media}
                        onClick={media.isTarget === "1" ? () => this.selectCorrect(media.id) : () => this.selectWrong(media.id) }
                        className={media.className}
                        upperText={upperText === "english" ? media.english : media.thai} 
                        lowerText={lowerText === undefined ? undefined : media.phonetic }
                    />
                    ))}
                </React.Fragment>
                }
            </React.Fragment>
            
        )
    }
}

export default withStyles(styles)(MultiChoiceSlide);