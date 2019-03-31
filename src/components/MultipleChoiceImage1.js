import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import AudioPrompt from './AudioPrompt';


class MultipleChoiceImage1 extends React.Component { 

    state = {
        images: null,
        slideId: 0,
        result: 0,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.slide.id !== prevState.slideId) {
            let images = {};
            nextProps.slide.medias.forEach(media => {
                images[media.id] = nextProps.classes.imageHolder;
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
        let images = {...this.state.images};
        images[id] = this.props.classes.imageHolderCorrect;
        this.setState({ images });
        setTimeout(() => {
            const result = this.state.result === -1 ? -1 : 1;
            this.props.moveNextSlide(result);
        }, 400);
    }

    selectWrong = id => {
        let images = {...this.state.images};
        images[id] = this.props.classes.imageHolderWrong;
        this.setState({ 
            images,
            result: -1, 
        });
    }

    render() {
        const { classes, slide, imageUrl, target  } = this.props;
        const { images } = this.state;
        
        return (
            <React.Fragment>
                <AudioPrompt 
                    audioFileName={slide.audioFileName}
                    instructions={slide.instructions}
                    labelUpper={target.media.thai}
                    labelLower={target.media.phonetic}
                />
                <table className={classes.imageTable} align="center">
                    <tbody>
                    {images && images.map(image => 
                        <tr key={image.id}>
                            <td 
                                className={image.className}
                                onClick={image.isTarget === "1" ? 
                                    () => this.selectCorrect(image.id) :
                                    () => this.selectWrong(image.id)
                                }
                            >
                                <img alt="" className={classes.imageFit}  src={imageUrl + image.imageFileName}/> 
                            </td>
                        </tr>   
                    )}
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(MultipleChoiceImage1);