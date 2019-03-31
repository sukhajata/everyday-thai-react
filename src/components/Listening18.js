import React from 'react';

import MultiChoiceSlide from './MultiChoiceSlide';

const Listening18 = ({ slide, classes, selectCorrect, selectWrong, moveNextSlide }) => {
    return (
        <MultiChoiceSlide
            slide={slide}
            labelUpper=''
            labelLower=''
            moveNextSlide={moveNextSlide}
            upperText="thai"
            lowerText="phonetic"
        />
    )
}

export default Listening18;
