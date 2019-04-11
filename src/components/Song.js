import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Sound from 'react-sound';

import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';

import { getSubCategory, getSong } from '../services/dbAccess';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';
import settings from '../config/settings';

class Song extends React.Component {
  
    state = {
        phrases: [],
    }



    componentDidMount = async () => {
        let data = [];
        if (settings.firstLanguage === 'en') {
            data = getSubCategory(this.props.match.params.id);
        } else {
            data = await getSong(this.props.match.params.id);
        }
        
        const phrases = data.map(phrase => {
            return {
                ...phrase,
                playingStatus: Sound.status.STOPPED,
            }
        });

        this.setState({ phrases });
    }

    speak = (pid) => {
        const phrases = this.state.phrases.map(phrase => {
            if (phrase.pid === pid) {
                phrase.playingStatus = Sound.status.PLAYING;
            } else {
                phrase.playingStatus = Sound.status.STOPPED;
            }
            return phrase;
        });
        
        this.setState ({ phrases }); 
       
    }

    onFinishedSpeaking = (pid) => {
        const phrases = this.state.phrases.map(phrase => {
          if (phrase.pid === pid) {
            phrase.playingStatus = Sound.status.STOPPED;
          }
          return phrase;
        });
    
        this.setState({ phrases });
    }

    render() {
        const { phrases } = this.state;
        const { classes } = this.props;
        const english = settings.firstLanguage === 'en';

        return (
            <List>
                {phrases && phrases.map(phrase => 
                    <ListItem className={classes.white} button key={phrase.pid}>
                        <Sound 
                            url={
                                english ? 
                                settings.songUrl + phrase.fileName_F + '.mp3' :
                                settings.songUrl + phrase.audioFileName
                            }
                            playStatus={phrase.playingStatus}
                            onFinishedPlaying={() => this.onFinishedSpeaking(phrase.pid)}
                        />
                        <Card className={classes.full}>
                            <CardContent>
                            {!english &&
                                <>
                                    <Typography variant="body1">
                                        {phrase.secondLanguage}
                                    </Typography>
                                    <Typography variant="body1"  color="textSecondary">
                                        {phrase.firstLanguage}
                                    </Typography>
                                </>
                            }
                            {english &&
                                <>
                                    <Typography variant="body1">
                                        {phrase.thai_F}
                                    </Typography>
                                    <Typography variant="body1"  color="primary">
                                        {phrase.firstLanguage}
                                    </Typography>
                                    <Typography variant="body1" >
                                        {phrase.romanisation_F}
                                    </Typography>
                                    {phrase.literalTranslation &&
                                    <Typography variant="body1"  color="textSecondary">
                                        {phrase.literalTranslation}
                                    </Typography>
                                    }
                                    {phrase.notes &&
                                        <Typography className={classes.notes}>
                                        {phrase.notes}
                                        </Typography>                    
                                    }
                                </>
                            }
                                <Grid container  spacing={16} className={classes.topMargin}>
                                    <Grid item >
                                    {phrase.playingStatus === Sound.status.STOPPED &&
                                        <PlayCircleOutline
                                        onClick={() => this.speak(phrase.pid)}
                                        className={classes.playIcon}
                                        />
                                    }
                                    {phrase.playingStatus === Sound.status.PLAYING &&
                                        <PauseCircleOutline 
                                        onClick={() => this.onFinishedSpeaking(phrase.pid)}
                                        className={classes.playingIcon}
                                        />
                                    }
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                </ListItem> 
                )}
            </List>
        )
    }

}

export default withStyles(styles)(Song);