import React from 'react';
import {Link} from 'react-router-dom';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import {completeFanfics,onGoingFanfics} from './functions';

const BoxContent = (props) => {
    // console.log('props.userFandoms:',props.userFandoms)
    const { userFandoms, fandom, changeImageFlag } = props;
    const isFav = userFandoms&&userFandoms.includes(fandom.FandomName) ? true : false;
    const noImage = (fandom.Images.Image_Name_Main&&fandom.Images.Image_Name_Main!=='')&&
                    (fandom.Images.Image_Name_Main_Still&&fandom.Images.Image_Name_Main_Still!=='') ? '' : `/fandoms/nophoto.png`;
    const imageStill = noImage!=='' ? noImage : `/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Images.Image_Name_Main_Still}`;
    const imageGif = noImage!=='' ? noImage : `/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Images.Image_Name_Main}`;

    return (
        <CardActionArea>
            {props.isAuthenticated && 
                <span className='fandoms_star' onClick={() => props.markFavFandom(props.fandom.FandomName,props.userEmail)}>
                    <i className={`material-icons md-30 ${isFav ?  'yellow' : 'white'}`}>
                        {isFav ? 'star' : 'star_border'}
                    </i>
                </span>
            }
            <Link to={`/fanfics/${props.fandom.FandomName}`}>
                <CardMedia  className={`${changeImageFlag===fandom.FandomName ? 'hidden' : 'vissible'} fandoms_card_media`}
                    image={imageStill}
                    title={props.fandom.FandomName}/>     
                <CardMedia  className={`${changeImageFlag===fandom.FandomName ? 'vissible' : 'hidden'} fandoms_card_media`}
                    image={imageGif}
                    title={props.fandom.FandomName}/>       
                <CardContent className={`fandoms_card_content ${props.smallSize && 'fandoms_mobile'}`}>
                    {!props.smallSize
                    ?                                                  
                        <React.Fragment>                      
                            <Typography gutterBottom variant="h5" component="h2" className='fandoms_fandom_caption'>                                                   
                                {props.fandom.FandomName}
                            </Typography> 
                            <Typography variant="body1" color="textSecondary" component="p">
                                <b>{props.fandom.FandomUniverse}</b>
                            </Typography>
                            <br/>
                            <Typography variant="body1" color="textSecondary" component="p">
                                <span>Fanfics in Fandoms: </span><b>{props.fandom.FanficsInFandom.toLocaleString(undefined, {maximumFractionDigits:2})}</b>
                            </Typography>       
                            <Typography variant="body1" color="textSecondary" component="p">
                            <span>Complete Fanfics: </span>{completeFanfics(props.fandom)}
                            </Typography>       
                            <Typography variant="body1" color="textSecondary" component="p">
                            <span>In Progress Fanfics: </span>{onGoingFanfics(props.fandom)} 
                            </Typography>       
                        </React.Fragment>
                    :  <div  className='fandoms_mobile_overlay'>
                            <Typography className='fandoms_mobile_overlay_caption' gutterBottom variant="h5" component="h2">{props.fandom.FandomName}</Typography>
                    </div>
                    }
                </CardContent>
            </Link>
        </CardActionArea>  
    )
};

export default BoxContent;