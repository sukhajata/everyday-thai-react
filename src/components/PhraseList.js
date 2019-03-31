import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Sound from 'react-sound';

import Favorite from '@material-ui/icons/Favorite';
//import favourite from '../img/ic_favourite.png';
//import favouriteActive from '../img/ic_favourite_active.png';
//import play from '../img/ic_play1.png';
//import playing from '../img/ic_playing.png';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import { toggleFavourite } from '../services/dbAccess';

class PhraseList extends React.Component {
  
  state = {
    phrases: [],
  }

  /*componentDidMount = () => {
    const phrases = this.props.phrases.map(phrase => {
      return {
        ...phrase,
        playingStatus: Sound.status.STOPPED,
      }
    });
    this.setState({ phrases });
  }*/

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.phrases.length > 0) {
        if (prevState.phrases.length === 0 || nextProps.phrases[0].pid !== prevState.phrases[0].pid) { 
          const phrases = nextProps.phrases.map(phrase => {
            return {
              ...phrase,
              playingStatus: Sound.status.STOPPED,
            }
          });
          
          return { phrases };
      }
    }

    return null;
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

  handleClickToggleFavourite = (id) => {
    //update database and get result
    const isFavourite = toggleFavourite(id);
    //update UI
    let phrases = this.state.phrases.map(phrase => {
        if (phrase.pid === id) {
            phrase.isFavourite = isFavourite;
        }
        return phrase;
    });
    this.setState({ phrases });

  }

  render() {
    const { classes } = this.props;
    const { phrases } = this.state;
    const audioUrl = "https://sukhajata.com/audio/thai/";
    const voice = "F";

    return (
      <List dense>
        {phrases && phrases.map(phrase => {
          let fileName = '';
          if (phrase.fileName_F && phrase.fileName_F.indexOf('s') === 0) {
            fileName = audioUrl + 'songs/' + phrase.fileName_F + '.mp3';
          } else if (voice === 'F') {
            fileName =  audioUrl + 'female/' + phrase.fileName_F + '.mp3';
          } else {
            fileName =  audioUrl + 'male/' + phrase.fileName_F + '.mp3';
          }

          return (
            <ListItem className={classes.white} button key={phrase.pid}>
            <Sound 
              url={fileName}
              playStatus={phrase.playingStatus}
              onFinishedPlaying={() => this.onFinishedSpeaking(phrase.pid)}
            />
            <Card className={classes.full}>
              <CardContent>
                <Typography variant="body1" >
                  {phrase.firstLanguage}
                </Typography>
                <Typography variant="body1"  color="textSecondary">
                  {phrase.thai_F}
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
                  <Grid item>
                    <Favorite 
                      className={
                        phrase.isFavourite ? classes.favourite : classes.unFavourite
                      }
                      alt="toggle favourite" 
                      onClick={() => this.handleClickToggleFavourite(phrase.pid)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </ListItem>
          )
        })
      }
      </List>
    );
  }

}

export default withStyles(styles)(PhraseList);

/*<img alt="play audio" src={playingStatus[phrase.pid] === Sound.status.PLAYING ? playing : play} height="28"/>*/