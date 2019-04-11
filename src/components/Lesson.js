import React from 'reactn';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import MultipleChoiceImage1 from './MultipleChoiceImage1';
import MultipleChoiceText2 from './MultipleChoiceText2';
import MissingWord3 from './MissingWord3';
import Teaching4 from './Teaching4';
import MatchingPairsText6 from './MatchingPairsText6';
import Translate9 from './Translate9';
import MatchingPairsImage11 from './MatchingPairsImage11';
import Writing14 from './Writing14';
import Bingo15 from './Bingo15';
import Listening18 from './Listening18';

import Stars from './Stars';
import styles from '../styles';

import { getLesson, getSlideAndMedia } from '../services/dbAccess';

class Lesson extends React.Component {

    state = {
        loading: true,
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.log(error, info);
    }

    async componentDidMount() {
        const lesson = await getLesson(this.props.match.params.id);
        let score = [];
        lesson.slides.forEach(slide => {
            score.push(0);
        })
        
        this.setGlobal({ lesson, score });
        this.currentOrder = 1;
        await this.updateSlideData();
    }

    async updateSlideData() {
        const currentSlide = await getSlideAndMedia(this.global.lesson.slides[this.currentOrder - 1].id);
        let target = currentSlide.medias.find(item => item.isTarget === "1");
        
        this.setState({ 
            loading: false,
            currentSlide, 
            target 
        });
    }

    moveNextSlide = (result) => {
        let score = this.global.score.splice(0);
        score[this.currentOrder - 1] = result;
        this.setGlobal({ score });
        this.currentOrder++;
        if (this.global.lesson.slides[this.currentOrder - 1]) {
            this.updateSlideData();
        } else {
             //finished
             this.props.history.push({ 
                pathname: '/totals/' + this.props.match.params.id
            });
        }
       
    }

    render() {
        const { classes } = this.props;
        const imageUrl = "https://sukhajata.com/images/";
        const { loading, error, currentSlide, target } = this.state;
        const { lesson } = this.global;

        if (loading) return "Loading...";
        if (error) return `Error!: ${error}`;

        return (
            
            <Grid container
                justify="center"
                alignItems="center"
                spacing={8}
            >
                <Grid item>
                    {lesson && <Stars slides={lesson.slides}/>}
                </Grid>
                {currentSlide && 
                <Grid item className={classes.gridItem90}>
                    {currentSlide.categoryId === "1" &&
                        <MultipleChoiceImage1 
                            slide={currentSlide}
                            imageUrl={imageUrl}
                            target={target}
                            moveNextSlide={this.moveNextSlide}
                        />
                    }
                    {currentSlide.categoryId === "2" &&
                        <MultipleChoiceText2
                            slide={currentSlide}
                            imageUrl={imageUrl}
                            target={target}
                            moveNextSlide={this.moveNextSlide}
                        />
                    }
                    {currentSlide.categoryId === '3' &&
                        <MissingWord3
                            slide={currentSlide}
                            target={target}
                            moveNextSlide={this.moveNextSlide}
                        />
                    }
                    {currentSlide.categoryId === '4' &&
                        <Teaching4
                            slide={currentSlide}
                            imageUrl={imageUrl}
                            moveNextSlide={this.moveNextSlide}
                        />
                    }
                    {currentSlide.categoryId === '6' &&
                        <MatchingPairsText6
                            slide={currentSlide}
                            moveNextSlide={this.moveNextSlide}
                        />
                    }
                    {currentSlide.categoryId === '9' &&
                        <Translate9
                            slide={currentSlide}
                            moveNextSlide={this.moveNextSlide}
                        />
                    }
                    {currentSlide.categoryId === '11' &&
                        <MatchingPairsImage11
                            slide={currentSlide}
                            moveNextSlide={this.moveNextSlide}
                            imageUrl={imageUrl}
                        />
                    }
                    {currentSlide.categoryId === '14' &&
                        <Writing14
                            slide={currentSlide}
                            moveNextSlide={this.moveNextSlide}
                        />
                    }
                    {currentSlide.categoryId === '15' &&
                        <Bingo15
                            slide={currentSlide}
                            moveNextSlide={this.moveNextSlide}
                            target={target}
                        />
                    }
                    {currentSlide.categoryId === '18' &&
                        <Listening18
                            slide={currentSlide}
                            target={target}
                            moveNextSlide={this.moveNextSlide}
                        />
                    }
                </Grid>
                }
            </Grid>
            
        )
       

    }
}

export default withStyles(styles)(Lesson);