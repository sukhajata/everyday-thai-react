import React from 'react';

import MultiChoiceSlide from './MultiChoiceSlide';

export default function MissingWord3 ({ slide, moveNextSlide }) { 

    return (
        <MultiChoiceSlide
            slide={slide}
            labelUpper={slide.thai.substring(0, slide.thai.indexOf('('))}
            labelLower={slide.phonetic.substring(0, slide.phonetic.indexOf('('))}
            extra={slide.english}
            moveNextSlide={moveNextSlide}
            upperText="thai"
            lowerText="phonetic"
        />
    )
    
}