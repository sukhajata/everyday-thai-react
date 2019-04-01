
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import SwipeableViews from 'react-swipeable-views';
import Close from '@material-ui/icons/Close';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { BrowserView, MobileView } from "react-device-detect";

class Lightbox extends React.Component {

    state = {
        currentIndex: 0,
    }

    static getDerivedStateFromProps(props, state) {
        return({
            currentIndex: 0,
        })
    }

    next = () => {
        const { currentIndex } = this.state;
        if (this.props.images[currentIndex + 1]) {
            this.setState({
                currentImage: this.props.images[currentIndex + 1],
                currentIndex: currentIndex + 1,
            })
        }
    }

    previous = () => {
        const { currentIndex } = this.state;
        if (this.props.images[currentIndex - 1]) {
            this.setState({
                currentImage: this.props.images[currentIndex - 1],
                currentIndex: currentIndex - 1,
            })
        }
    }

    render () {
        const { images, open, handleModalClose } = this.props;
        const { currentIndex } = this.state;
        const { clientWidth, clientHeight } = document.documentElement;
        let imageWidth, imageHeight, imageVerticalMargin, imageHorizontalMargin;
        if (clientHeight < clientWidth) {
            imageHeight = clientHeight * 0.9;
            imageWidth = imageHeight;
        } else {
            imageWidth = clientWidth * 0.9;
            imageHeight = imageWidth;
        }
        imageVerticalMargin = (clientHeight - imageHeight) / 2;
        imageHorizontalMargin = (clientWidth -  imageWidth) / 2;

        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open} 
                onClose={this.handleModalClose}
                className="numnums"
            >
                <div >
                    <Close 
                        onClick={handleModalClose}
                        style={{ color: '#fff', fontSize: 48, position: 'absolute', right: 15, top: 15, zIndex: 1000 }}
                    />
                    <MobileView>
                        <KeyboardArrowRight
                            style={{ color: '#fff', fontSize: 48, position: 'absolute', right: imageHorizontalMargin/2, top: clientHeight/2, zIndex: 100 }}
                        />
                        <KeyboardArrowLeft
                            style={{ color: '#fff', fontSize: 48, position: 'absolute', left: imageHorizontalMargin/2, top: clientHeight/2, zIndex: 100 }}
                        />
                        <SwipeableViews >
                            {images.map(image => 
                                <img 
                                    key={image.image_name} 
                                    style={{ 
                                        width: imageWidth, 
                                        marginTop: imageVerticalMargin,
                                        marginBottom: imageVerticalMargin,
                                        marginLeft: imageHorizontalMargin,
                                        marginRight: imageHorizontalMargin,
                                        zIndex: 101,
                                    }}
                                    src={"https://sukhajata.com/h/img/full/" + image.image_name}
                                    alt={image.image_name}
                                />
                            )}
                        </SwipeableViews>
                    </MobileView>
                    <BrowserView>
                        {images.length > 0 &&
                            <React.Fragment>
                                <img 
                                    style={{ 
                                        width: imageWidth, 
                                        marginTop: imageVerticalMargin,
                                        marginBottom: imageVerticalMargin,
                                        marginLeft: imageHorizontalMargin,
                                        marginRight: imageHorizontalMargin
                                    }}
                                    src={"https://sukhajata.com/h/img/full/" + images[currentIndex].image_name}
                                    alt={images[currentIndex].image_name}
                                />
                                <KeyboardArrowRight
                                    onClick={this.next}
                                    style={{ color: '#fff', fontSize: 48, position: 'absolute', right: imageHorizontalMargin/2, top: clientHeight/2, zIndex: 1000 }}
                                />
                                <KeyboardArrowLeft
                                    onClick={this.previous}
                                    style={{ color: '#fff', fontSize: 48, position: 'absolute', left: imageHorizontalMargin/2, top: clientHeight/2, zIndex: 1000 }}
                                />
                            </React.Fragment>
                        }
                    </BrowserView>
                </div>
            </Modal>
        )
    }
}

export default Lightbox;

/*
                             style={{ 
                                    width: imageWidth, 
                                    height: imageHeight, 
                                    paddingTop: imageVerticalMargin,
                                    marginBottom: imageVerticalMargin,
                                    marginLeft: imageHorizontalMargin,
                                    marginRight: imageHorizontalMargin
                                }}
                                */