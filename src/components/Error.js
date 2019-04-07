import React from 'react';
import Typography from '@material-ui/core/Typography';

const Error = ({ message }) => {
    return (
        <Typography style={{ padding: 20, color: "red" }} >
            {message}
        </Typography>
    )
}

export default Error;