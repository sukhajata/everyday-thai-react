import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => {
    const marginLeft = document.documentElement.clientWidth / 2 - 15;

    return <CircularProgress style={{ marginLeft, marginTop: 50 }}/>

}

export default Loading;