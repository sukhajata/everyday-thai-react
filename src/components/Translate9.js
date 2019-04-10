import React from 'reactn';

import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import AudioPrompt from './AudioPrompt';

import { shuffle, checkCase, ucFirst } from '../services/helpers';
import { getLanguage, textToSpeechThai, textToSpeechEnglish } from '../services/dbAccess';
import settings from '../config/settings';

class Translate9 extends React.Component {

    state = {
        chipsUpper: [],
        chipsLower: [],
        target: null,
        slideId: 0,
        result: 0,
        currentOrder: 1,
        completed: false,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.slide.id !== prevState.slideId) {
            let chipsUpper = nextProps.slide.medias.map(media => {
                return {
                    ...media,
                    className: nextProps.classes.hidden,
                }
            });

            const chipsLower = shuffle(nextProps.slide.medias).map(media => {
                return {
                    ...media,
                    className: nextProps.classes.defaultChip,
                }
            })
            
            return {
                chipsUpper,
                chipsLower,
                target: nextProps.slide.medias[0],
                slideId: nextProps.slide.id,
                result: 0,
                currentOrder: 1,
                completed: false,
            }
            
        } else {
            return null;
        }
    }

    selectCorrectWord = order => {
        const { currentOrder } = this.state;
        const { slide, classes } = this.props;
        const chipsLower = this.state.chipsLower.map(item => {
            if (item.mediaOrder == order) {
                item.className = classes.correctChipFade;
            } else if (item.className === classes.wrongChip) {
                item.className = classes.defaultChip;
            }
            return item;
        });
        
        const chipsUpper = this.state.chipsUpper.map(item => {
            if (item.mediaOrder == order) {
                item.className = classes.upperChip;
            }
            return item;
        });
        
        if (slide.medias[currentOrder]) {
            const target = slide.medias[currentOrder];
            if (settings.firstLanguage === 'en') {
                textToSpeechThai(target.thai);
            } else {
                textToSpeechEnglish(target.english);
            }
            this.setState({ 
                chipsUpper, 
                chipsLower,
                currentOrder: currentOrder + 1,
                target, 
            });
        } else {
            //finished
            this.setState({ 
                chipsUpper, 
                chipsLower,
                completed: true,
            });
            
        }
       
    }

    selectWrongWord = order => {
        this.setState({ 
            result: -1,
        });
    }

    handleButtonClick = () => {
        const result = this.state.result === -1 ? -1 : 1;
        this.props.moveNextSlide(result);
    }

    render() {
        const { slide, classes } = this.props;
        const { target, chipsUpper, chipsLower, completed } = this.state;
        const language = getLanguage();
        const english = settings.firstLanguage === 'en';

        return (
            <React.Fragment>
                <AudioPrompt 
                    audioFileName={slide.audioFileName}
                    instructions={slide.instructions}
                    labelUpper={english ? slide.english : slide.thai}
                    textToSpeak={english ? slide.thai : slide.english}
                />
                <div 
                    style={{
                        visibility: completed ? "visible" : "hidden",
                        marginBottom: 10
                    }}
                >
                    {english ? slide.thai : slide.english}
                </div>
                {chipsUpper.map(item =>
                    <Chip key={item.mediaOrder}
                        className={item.className}
                        variant="outlined"
                        label={english ? item.thai + ' ' + item.phonetic : checkCase(item.english)}
                    />
                )}
                <div style={{ marginTop: 10, marginBottom: 10}} >
                {chipsLower.map((item, idx) => 
                    <Chip key={item.mediaOrder}
                        className={item.className}
                        onClick={item.thai === target.thai || item.english === target.english ? 
                            () => this.selectCorrectWord(item.mediaOrder) 
                            : () => this.selectWrongWord(item.mediaOrder)
                        }
                        label={english ? item.thai + ' ' + item.phonetic : checkCase(item.english)}
                    />
                )}
                </div>
                <Button
                    className={classes.navigation}
                    disabled={!completed}
                    onClick={this.handleButtonClick}
                >
                {language.continue}
                </Button>
            </React.Fragment>
    
        )
    }
}

export default withStyles(styles)(Translate9);