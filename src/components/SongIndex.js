import React from 'react';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

import { Link } from "react-router-dom";

import { getSongs } from '../services/dbAccess';
import styles from '../styles';

class SongIndex extends React.Component{

    state = {
        songs: [],
    }

    async componentDidMount() {
        const songs = await getSongs();
        this.setState({ songs });
    }

    render() {
        const { songs } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.contentContainer}>
                {songs.map( song => 
                    <Card key={song.id} className={classes.titleCard}>
                        <Link to={song.id} className={classes.listLink}>
                            <CardContent>
                                <Typography variant="h6">{song.c_name}</Typography>
                                {song.thai && <Typography variant="body1">{song.thai}</Typography>}
                            </CardContent>
                        </Link>
                    </Card>
                )}
            </div>
        )
    }
}

export default withStyles(styles)(SongIndex);