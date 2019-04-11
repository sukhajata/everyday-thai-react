import React from 'react';

import MultiChoiceSlide from './MultiChoiceSlide';
import settings from '../config/settings';

const english = settings.firstLanguage === 'en';

const Listening18 = ({ slide, classes, selectCorrect, selectWrong, moveNextSlide, target }) => {
    return (
        <MultiChoiceSlide
            slide={slide}
            labelUpper=''
            labelLower=''
            textToSpeak={english ? target.thai : target.english}
            moveNextSlide={moveNextSlide}
            upperText={english ? "thai" : "english"}
            lowerText={english ? "phonetic" : ""}
        />
    )
}

export default Listening18;
