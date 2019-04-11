import React from 'react';

import MultiChoiceSlide from './MultiChoiceSlide';
import settings from '../config/settings';


export default function MissingWord3 ({ slide, target, moveNextSlide }) { 

    const english = settings.firstLanguage === 'en';
    let textToSpeak, sentence;
    if (english) {
        const start = slide.thai.indexOf('_');
        const end = start + 6;
        sentence = slide.thai.substring(0, slide.thai.indexOf('('))
        textToSpeak = sentence.substring(0, start) + target.thai + sentence.substring(end);
    } else {
        const start = slide.english.indexOf('_');
        const end = start + 6;
        sentence= slide.english.substring(0, slide.english.indexOf('('));
        textToSpeak = sentence.substring(0, start) + target.english + sentence.substring(end);
    }
    
    return (
        <MultiChoiceSlide
            slide={slide}
            textToSpeak={textToSpeak}
            labelUpper={sentence}
            labelLower={english ? slide.phonetic.substring(0, slide.phonetic.indexOf('(')) : ''}
            extra={english ? slide.english : slide.thai}
            moveNextSlide={moveNextSlide}
            upperText={english ? "thai" : "english" }
            lowerText={english ? "phonetic" : ""}
        />
    )
    
}