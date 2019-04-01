import React from 'reactn';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getPartners } from '../services/dbAccess';

const graphUrl = "https://graph.facebook.com/";


class Partners extends React.Component {

    state = {
        loading: true,
        partners: [],
    }

    async componentDidMount() {
        const results = await getPartners();
        let partners = await this.getProfilePics(results);

        this.setState({ 
            partners,
            loading: false 
        });
    }

    getProfilePics = users => {
        const promises = users.map(async item => {
            const result = await fetch(graphUrl + item.FacebookId + '/picture?height=100');    
            return {
                ...item,
                url: result.url,
            }
        });

        return Promise.all(promises);
    }

    getThumbnail = async facebookId => {
        const result = await fetch(graphUrl + facebookId + '/picture?height=100');
        return result.url;
    }

    render() {
        const { partners, loading } = this.state;
        const marginLeft = document.documentElement.clientWidth / 2 - 15;

        if (loading) return <CircularProgress style={{ marginLeft, marginTop: 50 }}/>

        return (
            <React.Fragment>
            {partners.map(partner => 
                <Card key={partner.Id} style={{ margin: 20 }}>
                    <CardContent>
                        <Grid container spacing={16} >
                            <Grid item>
                                <img 
                                    src={partner.url} 
                                    alt="profile" 
                                />
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">
                                    {partner.Name}
                                </Typography>
                            {partner.Age > 0 &&
                                <Typography variant="body1">
                                    {partner.Age}
                                </Typography>
                            }
                                <Typography variant="body1">
                                    {partner.Province}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                
            )}
            </React.Fragment>
        )
    }
}

export default Partners;