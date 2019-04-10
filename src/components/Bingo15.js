import React from 'reactn';

import Chip from '@material-ui/core/Chip';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import AudioPrompt from './AudioPrompt';

import { shuffle } from '../services/helpers';
import settings from '../config/settings';

class Bingo15 extends React.Component {

    state = {
        chips: [],
        target: null,
        slideId: 0,
        result: 0,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.slide.id !== prevState.slideId) {

            const chips = shuffle(nextProps.slide.medias).map(media => {
                return {
                    ...media,
                    className: nextProps.classes.defaultChip,
                }
            })
            
            return {
                chips,
                target: nextProps.target,
                slideId: nextProps.slide.id,
                result: 0,
            }
            
        } else {
            return null;
        }
    }

    handleChipClick = media => {
        if (media.id === this.state.target.id) {
            const result = this.state.result === 0 ? 1 : -1;
            this.props.moveNextSlide(result);
        } else {
            this.setState({
                result: -1,
            })
        }
    }

    render() {
        const { slide } = this.props;
        const { target, chips } = this.state;
        const english = settings.firstLanguage === 'en';

        return (
            <React.Fragment>
                <AudioPrompt 
                    textToSpeak={english ? target.thai : target.english}
                    audioFileName={slide.audioFileName}
                    instructions={slide.instructions}
                    labelUpper={english ? target.english : target.thai}
                />
                {chips.map(item =>
                    <Chip key={item.id}
                        className={item.className}
                        variant="outlined"
                        label={english ? item.thai + ' ' + item.phonetic : item.english}
                        onClick={() => this.handleChipClick(item)}
                    />
                )}
            
            </React.Fragment>
    
        )
    }
}

export default withStyles(styles)(Bingo15);