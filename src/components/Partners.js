import React from 'reactn';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Loading from './Loading';

import { getPartners, getUser, translate } from '../services/dbAccess';
import settings from '../config/settings';

const graphUrl = "https://graph.facebook.com/";


class Partners extends React.Component {

    state = {
        loading: true,
        partners: [],
    }

    async componentDidMount() {
        const user = await getUser();
        if (!user) {
            this.props.history.push('/login/');
        } else {
            const results = await getPartners();
            this.setState({ 
                partners: results,
                loading: false,
            });
            
            const partnersWithPics = await this.getProfilePics(results);
            this.setState({ 
                partners: partnersWithPics
            });

            if(settings.firstLanguage === 'en') {
                const translated = await this.translateDetails(partnersWithPics);
                this.setState({
                    partners: translated,
                })
            }
        }
    }

    getProfilePics = users => {
        const promises = users.map(async item => {
            const result = await fetch(graphUrl + item.facebookId + '/picture?height=100');    
            return {
                ...item,
                url: result.url,
            }
        });

        return Promise.all(promises);
    }

    translateDetails = partners => {
        const promises = partners.map(async partner => {
            const province = await translate(partner.province, 'en');
            return {
                ...partner,
                province,
            }
        });

        return Promise.all(promises);
    }


    chat = async partnerId => {
        this.props.history.push('/chat/' + partnerId);
    }

    render() {
        const { partners, loading } = this.state;
        const english = settings.firstLanguage === 'en';

        if (loading) return <Loading />

        return (
            <React.Fragment>
            {partners.map(partner => 
                <Card key={partner.id} style={{ margin: 20 }}>
                    <CardContent onClick={() => this.chat(partner.facebookId)}>
                        <Grid container spacing={16} >
                        {partner.url &&
                            <Grid item>
                                <img 
                                    src={partner.url} 
                                    alt="profile" 
                                />
                            </Grid>
                        }
                            <Grid item>
                                <Typography variant="body1">
                                    {partner.name}
                                </Typography>
                            {partner.age > 0 &&
                                <Typography variant="body1">
                                    {partner.age}
                                </Typography>
                            }
                                <Typography variant="body1">
                                    {english ? partner.province : partner.country}
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