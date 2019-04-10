import React from 'react';

import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import { Typography } from '@material-ui/core';

import Sound from 'react-sound';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';
import settings from '../config/settings';
import { textToSpeechEnglish, textToSpeechThai } from '../services/dbAccess';

class AudioPrompt extends React.Component{
    state = {
        playingStatus: Sound.status.PLAYING,
        textToSpeak: '',
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.textToSpeak !== prevState.textToSpeak) {
            if (settings.firstLanguage === 'en') {
                textToSpeechThai(nextProps.textToSpeak);
            } else {
                textToSpeechEnglish(nextProps.textToSpeak);
            }    
            return {
                textToSpeak: nextProps.textToSpeak,
            }
        } 
        
        return null;
        
    }


    onFinishedSpeaking = () => {
        this.setState ({
            playingStatus: Sound.status.STOPPED,
        });
    }

    playSound = () => {
        if (settings.firstLanguage === 'en') {
            textToSpeechThai(this.props.textToSpeak);
        } else {
            textToSpeechEnglish(this.props.textToSpeak);
        }
    }
    
    handleClickPlay = () => {
        this.playSound();

        this.setState({
            playingStatus: Sound.status.PLAYING,
        });
    }

    render() {
        const { classes, instructions, audioFileName, labelUpper, labelLower, extra } = this.props; 
        const { playingStatus } = this.state;
        const audioUrl = settings.audioUrl;
        
        return (
        <React.Fragment>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <VolumeUpIcon 
                                onClick={this.handleClickPlay} 
                                className={playingStatus === Sound.status.PLAYING ? classes.playingIcon : classes.playIcon}
                            />
                        </td>
                        <td>
                            <Typography variant="body1" style={{paddingTop: 5, paddingBottom: 5 }}>{instructions}</Typography>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style={{ marginBottom: 10 }}>
                    <Typography variant="body1">
                        {labelUpper}
                    </Typography>
                    {labelLower && <Typography variant="body1">{labelLower}</Typography>}
                    {extra && <Typography variant="body1" color="primary">{extra}</Typography>}
                
            </div>
        </React.Fragment>
        )
    }

}

export default withStyles(styles)(AudioPrompt);
/*
 <Sound 
                    url={audioUrl + audioFileName}
                    playStatus={playingStatus}
                    onFinishedPlaying={this.onFinishedSpeaking}
                />
                    */