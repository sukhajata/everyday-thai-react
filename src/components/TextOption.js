import React from 'react';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

function TextOption ({ onClick, className, upperText, lowerText }) {
    return (
        <Card
            className={className}
            onClick={onClick}
        >
            <CardContent>
                <Typography variant="body1">
                    {upperText}<br/>
                    {lowerText}
                </Typography>
            </CardContent>
        </Card>
    )
}


export default TextOption;