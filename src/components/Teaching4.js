import React from 'reactn';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
//import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import Sound from 'react-sound';
import { getLanguage } from '../services/dbAccess';

class Teaching4 extends React.Component { 

    state = {
        mediaPlaying: null,
    }

    componentDidMount() {
        let mediaPlaying = {};
        this.props.slide.medias.forEach(media => {
            mediaPlaying[media.id] = Sound.status.STOPPED;
        });
        this.setState({ mediaPlaying })
    }

    playSound = id => {
        let mediaPlaying = {...this.state.mediaPlaying};
        for (let key in mediaPlaying) {
            if (key === id) {
                mediaPlaying[key] = Sound.status.PLAYING;
            } else {
                mediaPlaying[key] = Sound.status.STOPPED;
            }
        }
        this.setState({ mediaPlaying });
    }

    stopSound = id => {
        let mediaPlaying = {...this.state.mediaPlaying};
        mediaPlaying[id] = Sound.status.STOPPED;
        this.setState({ mediaPlaying });
    }

    render() {
        const { classes, slide, moveNextSlide } = this.props;
        const { mediaPlaying } = this.state;
        const language = getLanguage(this.global.code);
        const audioUrl = "https://sukhajata.com/audio/thai/female/";

        return (
            <React.Fragment>
                <Typography variant="body1">
                    {slide.english}
                </Typography>
                {mediaPlaying && slide.medias.map(media => (
                    <Card key={media.id}
                        className={classes.defaultCard}
                    >
                        <CardContent>
                            <Sound 
                                url={audioUrl + "f2_5.mp3"}
                                playStatus={mediaPlaying[media.id]}
                                onFinishedPlaying={() => this.stopSound(media.id)}
                                onError={(errorCode, description) => console.log(description)}
                            />
                            <Grid 
                                container 
                                direction="column"
                                justify="flex-start"
                            >
                                <Grid item>
                                    <Typography variant="body1">
                                        {media.thai}
                                    </Typography>
                                    <Typography variant="body1">
                                        {media.phonetic}
                                    </Typography>
                                    <Typography variant="body1" color="primary">
                                        {media.english}
                                    </Typography>
                                    {media.literalTranslation && 
                                        <Typography variant="body1" color="textSecondary">
                                            ({media.literalTranslation})
                                        </Typography>
                                    }
                                    {media.notes  && 
                                        <Typography className={classes.notes}>
                                            {media.notes}
                                        </Typography>
                                    }
                                    <PlayArrowIcon 
                                        onClick={
                                            mediaPlaying[media.id] === Sound.status.PLAYING ?
                                            () => this.stopSound(media.id) :
                                            () => this.playSound(media.id)
                                        }
                                        fontSize="small" 
                                        className={
                                            mediaPlaying[media.id] === Sound.status.PLAYING ?
                                            classes.playingIcon :
                                            classes.playIcon
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))}
                <Button 
                    variant="contained" 
                    className={classes.navigation}
                    onClick={() => moveNextSlide(1)}
                >
                    {language.continue}
                </Button>
                
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Teaching4);