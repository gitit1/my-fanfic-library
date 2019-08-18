import React from 'react';
import {Link} from 'react-router-dom';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '../../../../components/UI/Button/Button'

const BoxContent = (props) => (
    <React.Fragment>
        {/* <CardActionArea className='fandoms_card_action' style={{height:props.height-100}}> */}
            <CardActionArea>
                <Link to={`/fanfics/${props.fandom.FandomName}`}>       
                    <CardMedia  className='fandoms_card_media'
                                image={props.fandom.Image_Name_Main !== '' 
                                        ? `/fandoms/${props.fandom.FandomName.toLowerCase()}/${props.fandom.Image_Name_Main}`
                                        : `/fandoms/nophoto.png`
                                } 
                                title={props.fandom.FandomName}/>
                </Link> 
            </CardActionArea>
            <CardContent className={`fandoms_card_content ${props.smallSize ? 'fandoms_mobile' : null}`} 
                         style={props.smallSize ? {height:props.height-300} : {height:props.height-360}}>
                {
                        !props.smallSize
                        ?                                                  
                            <React.Fragment>
                                <Typography gutterBottom variant="h5" component="h2" className='fandoms_fandom_caption'>{props.fandom.FandomName}</Typography>
                                <Typography variant="body1" color="textSecondary" component="p">
                                    <span>Search Keys: </span><b>{props.fandom.SearchKeys}</b>
                                </Typography>       
                                <Typography variant="body1" color="textSecondary" component="p">
                                <span>Auto Save: </span>{props.fandom.AutoSave ? 'Yes' : 'No'}
                                </Typography>
                                {props.fandom.AutoSave &&  
                                    <Typography variant="body1" color="textSecondary" component="p">
                                    <span>Auto Save Types:</span> {props.fandom.SaveMethod}
                                    </Typography>
                                }      
                            </React.Fragment>
                        :  <div  className='fandoms_mobile_overlay'>
                                <Typography className='fandoms_mobile_overlay_caption' gutterBottom variant="h5" component="h2">{props.fandom.FandomName}</Typography>
                            </div>
                }
            </CardContent>
            <CardActions className='fandoms_fandom_buttons'>
                <Button clicked={() => props.editFandom(props.fandom)}>Edit</Button>
                <Button clicked={() => props.deleteFandom(props.fandom.id,props.fandom.FandomName)}>Delete</Button>
            </CardActions> 
    </React.Fragment>  
                                
);

export default BoxContent;
