import React from 'react';
import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './Welcome.scss';

const Welcome = (props) => {
    const { isAuthenticated } = props;
    return(
        <>
        <h1>Welcome to my wlw fanfics library - The home of gay women couples’ fanfics</h1><br/>
        <Grid item sm={12} className='welcome_container' >
            <Card className='welcome_container_box'>
                <CardContent>
            {!isAuthenticated &&
                <div className='welcome'>
                    <p>Manage your wlw fanfics reading in one place - we show fanfics from ao3,ff,wattpad,tumblr... and put them in one place!</p><br/>
                    <p>You can create reading lists , mark fanfics by finished/in progress (!!!), sort and filter them, find deleted fanfics and much more...</p><br/>
                    <h5>Please register to the site in order to manage your data.</h5><br/>
                </div> 
            }
            <p className='disclaimer_site'>The site is still not fully ready <b>but</b> the fanfic page functionality is working! you can add/track your favorite fanfics without the fear of it getting deleted while we continue working on the site to add more deleted fics, and much more fandoms info</p>
            <h4 className='disclaimer_site'>For any suggestions please <span><Link to={'/contact'}>reach out</Link></span></h4>
        </CardContent>
        </Card>
        </Grid>
        </>
    )
};

export default Welcome;