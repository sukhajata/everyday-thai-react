import React from 'reactn';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Loading from './Loading';

import { getPartners, getUser, translate } from '../services/dbAccess';

const graphUrl = "https://graph.facebook.com/";


class Partners extends React.Component {

    state = {
        loading: true,
        partners: [],
    }

    async componentDidMount() {
        if (!this.global.user) {
            const user = getUser();
            if (user) {
                this.setGlobal({
                    user
                });
                //console.log(user);
            } else {
                this.props.history.push('/login/');
            }
        }

        const results = await getPartners();
        this.setState({ 
            partners: results,
            loading: false,
        });
        
        const partners = await this.getProfilePics(results);
        this.setState({ 
            partners, 
        });

        if(this.global.code === 'en') {
            const updated = await this.translateDetails(partners);
            this.setState({
                partners: updated,
            })
        }
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

    translateDetails = partners => {
        const promises = partners.map(async partner => {
            const province = await translate(partner.Province, 'en');
            return {
                ...partner,
                Province: province,
            }
        });

        return Promise.all(promises);
    }


    chat = async partnerId => {
        this.props.history.push('/chat/' + partnerId);
    }

    render() {
        const { partners, loading } = this.state;
        
        if (loading) return <Loading />

        return (
            <React.Fragment>
            {partners.map(partner => 
                <Card key={partner.Id} style={{ margin: 20 }}>
                    <CardContent onClick={() => this.chat(partner.Id)}>
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
                                    {partner.Name}
                                </Typography>
                            {partner.Age > 0 &&
                                <Typography variant="body1">
                                    {partner.Age}
                                </Typography>
                            }
                                <Typography variant="body1">
                                    {partner.Province }
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