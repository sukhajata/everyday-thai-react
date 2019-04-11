import React from 'reactn';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Loading from './Loading';

import { getPartners, getUser, translate } from '../services/dbAccess';
import settings from '../config/settings';

const english = settings.firstLanguage === 'en';

class Partners extends React.Component {

    state = {
        loading: true,
        partners: [],
    }

    async componentDidMount() {
        const user = await getUser();
        if (!user) {
            this.props.history.push('/signin/');
        } else {
            const results = await getPartners();
            this.setState({ 
                partners: results,
                loading: false,
            });

            const translated = await this.translateDetails(results);
            this.setState({
                partners: translated,
                loading: false,
            })
        }
    }

    translateDetails = partners => {
        const promises = partners.map(async partner => {
            if (english) {
                const province = await translate(partner.province, 'en');
                return {
                    ...partner,
                    province,
                }
            } else {
                const country = await translate(partner.country, 'th');
                return {
                    ...partner,
                    country,
                }
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
                    <CardContent onClick={() => this.chat(partner.id)}>
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