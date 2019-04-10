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
import settings from '../config/settings';

import Sound from 'react-sound';
import { getLanguage, textToSpeechEnglish, textToSpeechThai } from '../services/dbAccess';

class Teaching4 extends React.Component { 

    state = {
        cards: [],
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.slide.id !== prevState.slideId) {
            const { classes, slide } = nextProps;
            let cards = [];
            slide.medias.forEach(media => {
                cards.push({
                    ...media,
                    className: classes.playIcon,
                })
            });
            
            return {
                cards,
                slideId: nextProps.slide.id,
            }
        } else {
            return null;
        }
    }

    /*componentDidMount() {
        let mediaPlaying = {};
        this.props.slide.medias.forEach(media => {
            mediaPlaying[media.id] = Sound.status.STOPPED;
        });
        this.setState({ mediaPlaying })
    }*/

    playSound = media => {
        if (settings.firstLanguage === 'th') {
            textToSpeechEnglish(media.english);
        } else {
            textToSpeechThai(media.thai);
        }
        const cards = this.state.cards.map(card => {
            if (card.id === media.id) {
                card.className = this.props.classes.playingIcon;
            }
            return card;
        });
        this.setState({ cards });

        setTimeout(this.stopSound(media.id), 2000);
        /*let mediaPlaying = {...this.state.mediaPlaying};
        for (let key in mediaPlaying) {
            if (key === media.id) {
                mediaPlaying[key] = Sound.status.PLAYING;
            } else {
                mediaPlaying[key] = Sound.status.STOPPED;
            }
        }
        this.setState({ mediaPlaying });

        setTimeout(this.stopSound(media.id), 500);*/
    }

    stopSound = id => {
        const cards = this.state.cards.map(card => {
            return {
                ...card,
                className: this.props.classes.playIcon,
            }
        });
        this.setState({ cards });
        /*let mediaPlaying = {...this.state.mediaPlaying};
        mediaPlaying[id] = Sound.status.STOPPED;
        this.setState({ mediaPlaying });*/
    }

    render() {
        const { classes, slide, moveNextSlide } = this.props;
        const { cards } = this.state;
        const language = getLanguage();
        const english = settings.firstLanguage === 'en'
//        const audioUrl = "https://sukhajata.com/audio/thai/female/";

        return (
            <React.Fragment>
                <Typography variant="body1">
                    {english ? slide.english : slide.thai}
                </Typography>
                {cards && cards.map(media => (
                    <Card key={media.id}
                        className={classes.defaultCard}
                    >
                        <CardContent>
                            <Grid 
                                container 
                                direction="column"
                                justify="flex-start"
                            >
                                <Grid item>
                                    <Typography variant="body1">
                                        {english ? media.thai : media.english}
                                    </Typography>
                                    {settings.firstLanguage === 'en' &&
                                    <Typography variant="body1">
                                        {media.phonetic}
                                    </Typography>
                                    }
                                    <Typography variant="body1" color="primary">
                                        {english ? media.english : media.thai}
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
                                        onClick={() => this.playSound(media)}
                                        fontSize="small" 
                                        className={media.className}
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
/*                          <Sound 
                                url={audioUrl + "f2_5.mp3"}
                                playStatus={mediaPlaying[media.id]}
                                onFinishedPlaying={() => this.stopSound(media.id)}
                                onError={(errorCode, description) => console.log(description)}
                            />
                             onClick={
                                            mediaPlaying[media.id] === Sound.status.PLAYING ?
                                            () => this.stopSound(media.id) :
                                            () => this.playSound(media)
                                        }
                            */