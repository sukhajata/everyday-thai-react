import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import Mood from '@material-ui/icons/Mood';
import MoodBad from '@material-ui/icons/MoodBad';

import AudioPrompt from './AudioPrompt';

import { shuffle } from '../services/helpers';
import settings from '../config/settings';

class MultipleChoiceImage1 extends React.Component { 

    state = {
        images: [],
        slideId: 0,
        result: 0,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.slide.id !== prevState.slideId) {
            const images = shuffle(nextProps.slide.medias).map(media => {
                return {
                    ...media,
                    correct: false,
                    wrong: false,
                }
            });
            return {
                images,
                slideId: nextProps.slide.id,
                result: 0,
            }
        } else {
            return null;
        }
    }

    selectCorrect = id => {
        const images = this.state.images.map(image => {
            if (image.id === id) {
                image.correct = true;
            }
            return image;
        });
        
        this.setState({ images });
        setTimeout(() => {
            const result = this.state.result === -1 ? -1 : 1;
            this.props.moveNextSlide(result);
        }, 400);
    }

    selectWrong = id => {
        const images = this.state.images.map(image => {
            if (image.id === id) {
                image.wrong = true;
            }
            return image;
        });
        
        this.setState({ 
            images,
            result: -1, 
        });
    }

    render() {
        const { classes, slide, imageUrl, target  } = this.props;
        const { images } = this.state;
        const english = settings.firstLanguage === 'en';

        return (
            <React.Fragment>
                <AudioPrompt 
                    audioFileName={slide.audioFileName}
                    textToSpeak={english ? target.thai : target.english}
                    instructions={slide.instructions}
                    labelUpper={english ? target.thai : target.english}
                    labelLower={english ? target.phonetic : ''}
                />
                <table className={classes.imageTable} align="center">
                    <tbody>
                    {images.map(image => 
                        <tr key={image.id}>
                        {image.correct &&
                            <td style={{ position: 'relative' }}>
                                <img 
                                    alt="" 
                                    className={classes.imageBlur}  
                                    src={imageUrl + image.imageFileName}
                                /> 
                                <div className={classes.middle}>
                                    <Mood className={classes.correctIcon} />
                                </div>
                            </td>
                        }
                        {image.wrong &&
                            <td style={{ position: 'relative' }}>
                                <img 
                                    alt="" 
                                    className={classes.imageBlur}  
                                    src={imageUrl + image.imageFileName}
                                /> 
                                <div className={classes.middle}>
                                    <MoodBad className={classes.wrongIcon} />
                                </div>
                            </td>
                        }   
                        {!image.wrong && !image.correct &&
                            <td >
                                <img 
                                    alt="" 
                                    className={classes.imageFit}  
                                    onClick={image.isTarget === "1" ? 
                                        () => this.selectCorrect(image.id) :
                                        () => this.selectWrong(image.id)
                                    }
                                    src={imageUrl + image.imageFileName}
                                /> 
                            </td>
                        }
                        </tr>   
                    )}
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(MultipleChoiceImage1);