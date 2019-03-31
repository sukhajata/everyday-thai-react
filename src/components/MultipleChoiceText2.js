import React from 'react';

import MultiChoiceSlide from './MultiChoiceSlide';

export default function MultipleChoiceText2 ({ slide, target, moveNextSlide }) { 

    return (
        <MultiChoiceSlide
            slide={slide}
            labelUpper={target.thai}
            labelLower={target.phonetic}
            extra={slide.english}
            moveNextSlide={moveNextSlide}
            upperText="english"
        />            
    )
    
}
