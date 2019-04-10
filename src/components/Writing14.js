import React from 'react';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import AudioPrompt from './AudioPrompt';
import { shuffle } from '../services/helpers';
import settings from '../config/settings';
import { textToSpeechEnglish, textToSpeechThai, getLanguage } from '../services/dbAccess';
import { Button } from '@material-ui/core';

class Writing14 extends React.Component {

    state = {
        completed: false,
    }

    handleChange = ({ target }) => {
        if (settings.firstLanguage === 'en') {
            if (target.value === this.props.slide.medias[0].thai) {
                this.setState({
                    completed: true
                })
            }
        } else {
            if (target.value.toLowerCase() === this.props.slide.medias[0].english.toLowerCase()) {
                this.setState({
                    completed: true,
                })
            }
        }
        
    }

    handleButtonClick = () => {
        const result = this.state.completed ? 1 : -1;
        this.props.moveNextSlide(result);
    }

    render() {
        const { slide, classes } = this.props;
        const { completed, text } = this.state;
        const english = settings.firstLanguage === 'en';
        const language = getLanguage();

        return (
            <>
            {slide &&
                <>
                    <AudioPrompt
                        upperText={english ? slide.medias[0].thai : slide.medias[0].english}
                        textToSpeak={english ? slide.medias[0].thai : slide.medias[0].english}
                        instructions={slide.instructions}
                    />
                    <Typography variant="body1" style={{ marginBottom: 10 }}>
                        {english ? slide.medias[0].thai : slide.medias[0].english}
                    </Typography>
                    <TextField
                        style={{ width: '100%', marginBottom: 10 }}
                        onChange={this.handleChange}
                        variant="outlined"
                    />
                    <Button
                        className={classes.navigation}
                        disabled={!completed}
                        onClick={() => this.handleButtonClick()}
                    >
                        {language.continue}
                    </Button>
                    <Button
                        className={classes.cheat}
                        onClick={() => this.handleButtonClick()}
                    >
                        {language.cannot}
                    </Button>
                </>
            }
            </>
        )
    }
}

export default withStyles(styles)(Writing14);