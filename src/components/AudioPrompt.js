import React from 'react';

import Grid from '@material-ui/core/Grid';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import IconButton from '@material-ui/core/IconButton';

import Sound from 'react-sound';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';
import { Typography } from '@material-ui/core';

class AudioPrompt extends React.Component{
    state = {
        playingStatus: Sound.status.PLAYING,
    }

    onFinishedSpeaking = () => {
        this.setState ({
            playingStatus: Sound.status.STOPPED,
        });
    }

    handleClickPlay = () => {
        this.setState({
            playingStatus: Sound.status.PLAYING,
        });
    }

    render() {
        const { classes, instructions, audioFileName, labelUpper, labelLower, extra } = this.props; 
        const { playingStatus } = this.state;
        const audioUrl = "https://sukhajata.com/audio/thai/female/";
        
        return (
        <React.Fragment>
            <table>
                <Sound 
                    url={audioUrl + audioFileName}
                    playStatus={playingStatus}
                    onFinishedPlaying={this.onFinishedSpeaking}
                />
                <tbody>
                    <tr>
                        <td>
                            <VolumeUpIcon onClick={this.handleClickPlay} className={playingStatus === Sound.status.PLAYING ? classes.playingIcon : classes.playIcon}/>
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
 
                    */