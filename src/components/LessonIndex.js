import React from 'react';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

import { Link } from "react-router-dom";

import styles from '../styles';

import { getLessons } from '../services/dbAccess';

class LessonIndex extends React.Component{

    state = {
        loading: true,
    }

    async componentDidMount() {
        const lessons = await getLessons();
        this.setState({ 
            loading: false,
            lessons 
        });
    }

    render() {
        const { loading, error, lessons } = this.state;
        const { classes } = this.props;
        
        if (loading) return  <Typography className={classes.loading} variant="body1">Loading...</Typography>;
        if (error) return <Typography variant="body1">Error! {error.message} </Typography>;
        
        return (
            <div className={classes.content}>
                {lessons && lessons.map(({ id, name, description, selected }) => (
                    <Card key={id} className={classes.titleCard}>
                        <Link to={id} className={classes.listLink}>
                            <CardContent>
                                <Typography variant="h6">{name}</Typography>
                                <Typography variant="body1">{description}</Typography>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        )
    }
}

export default withStyles(styles)(LessonIndex);