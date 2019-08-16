import React from 'react';
import {Link} from 'react-router-dom';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const BoxContent = (props) => (
    <CardActionArea>
        <Link to={`/fanfics/${props.fandom.FandomName}`}>
            <CardMedia  className='fandoms_card_media'
                        image={props.fandom.Image_Name !== '' 
                                ? `/fandoms/${props.fandom.FandomName.toLowerCase()}/${props.fandom.Image_Name}`
                                : `/fandoms/nophoto.png`
                        } 
                        title={props.fandom.FandomName}/>
            <CardContent className={`fandoms_card_content ${props.screenSize==='s' ? 'fandoms_mobile' : null}`}>
                {(props.screenSize==='l'||props.screenSize==='m')
                ?                                                  
                    <React.Fragment>
                        {console.log('heree..')}
                        <Typography gutterBottom variant="h5" component="h2" className='fandoms_fandom_caption'>{props.fandom.FandomName}</Typography>
                        <Typography variant="body1" color="textSecondary" component="p">
                            <span>Fanfics in Fandoms: </span><b>{props.fandom.FanficsInFandom.toLocaleString(undefined, {maximumFractionDigits:2})}</b>
                        </Typography>       
                        <Typography variant="body1" color="textSecondary" component="p">
                        <span>Complete Fanfics: </span>{props.fandom.CompleteFanfics.toLocaleString(undefined, {maximumFractionDigits:2})}
                        </Typography>       
                        <Typography variant="body1" color="textSecondary" component="p">
                        <span>In Progress Fanfics: </span>{props.fandom.OnGoingFanfics.toLocaleString(undefined, {maximumFractionDigits:2})} 
                        </Typography>       
                    </React.Fragment>
                :  <div  className='fandoms_mobile_overlay'>
                        <Typography className='fandoms_mobile_overlay_caption' gutterBottom variant="h5" component="h2">{props.fandom.FandomName}</Typography>
                </div>
                }
            </CardContent>
        </Link>
    </CardActionArea>   
);

export default BoxContent;