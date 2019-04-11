import React from 'react';

import MultiChoiceSlide from './MultiChoiceSlide';
import settings from '../config/settings';

export default function MultipleChoiceText2 ({ slide, target, moveNextSlide }) { 
    const english = settings.firstLanguage === 'en';

    return (
        <MultiChoiceSlide
            slide={slide}
            textToSpeak={english ? target.thai : target.english}
            labelUpper={english ? target.thai : target.english}
            labelLower={english ? target.phonetic : ''}
            extra={english ? slide.english : ''}
            moveNextSlide={moveNextSlide}
            upperText={english ? "english" : "thai"}
        />            
    )
    
}
