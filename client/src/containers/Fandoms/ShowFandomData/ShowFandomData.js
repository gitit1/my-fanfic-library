import React from 'react';
import classes from './ShowFandomData.module.css';
import {Link} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import GridList from '@material-ui/core/GridList';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        
        overflow: 'hidden',
        margin: '0 auto'
    },
    gridList: {
        width: '100%',
        height: 'auto',
        justifyContent: 'center',
    },
    card: {
      maxWidth: 400,
    },
    media: {
      height: 250,
    }
  });

const ShowFandomData = (props) => {
    const {screenSize,fandoms} = props,classesMterial = useStyles();

    const cellHeight = (screenSize==='l'||screenSize==='m') ? 400 : 240;
    const cols = (screenSize==='l') ? 3 : (screenSize==='m') ? 2 : 1;
    let length = fandoms.length;
    return(
        <React.Fragment>
            <div className={classesMterial.root} style={(screenSize==='l'||screenSize==='m') ? {width:'90%'} : {width:'100%'}}>
                <GridList cellHeight={cellHeight} className={classesMterial.gridList} cols={cols}>
                    {fandoms.map(fandom=>(
                        // <GridListTile cols={1}>
                            <Card className={`${classesMterial.card} ${classes.Fandom}`} key={fandom.FandomName} >
                                <CardActionArea>
                                    <Link to={`/fanfics/${fandom.FandomName}`}>
                                        <CardMedia  className={classesMterial.media} 
                                                    image={fandom.Image_Name !== '' 
                                                            ? `/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Image_Name}`
                                                            : `/fandoms/nophoto.png`
                                                    } 
                                                    title={fandom.FandomName}/>
                                        <CardContent className={classes.mobileMode}>
                                            {(screenSize==='l'||screenSize==='m')
                                             ?                                                  
                                                <React.Fragment>
                                                    <Typography gutterBottom variant="h5" component="h2">{fandom.FandomName}</Typography>
                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                        <span>Fanfics in Fandoms: </span><b>{fandom.FanficsInFandom.toLocaleString(undefined, {maximumFractionDigits:2})}</b>
                                                    </Typography>       
                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                    <span>Complete Fanfics: </span>{fandom.CompleteFanfics.toLocaleString(undefined, {maximumFractionDigits:2})}
                                                    </Typography>       
                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                    <span>In Progress Fanfics: </span>{fandom.OnGoingFanfics.toLocaleString(undefined, {maximumFractionDigits:2})} 
                                                    </Typography>       
                                                </React.Fragment>
                                             :  <div  className={classes.overlay}>
                                                    <Typography className={classes.overlayP} gutterBottom variant="h5" component="h2">{fandom.FandomName}</Typography>
                                                </div>
                                            }
                                        </CardContent>
                                    </Link>
                                </CardActionArea>
                            </Card>
                        // </GridListTile>
                    ))} 
                    {( (screenSize==='l'||screenSize==='m') && (length>cols && (length%cols!==0) && ((length-(Math.floor(length/cols)*cols)<=1)) ) ) && <Card className={`${classesMterial.card} ${classes.Fandom} ${classes.Dummy}`} />}
                    {( (screenSize==='l'||screenSize==='m') && (length>cols && (length%cols!==0) && ((length-(Math.floor(length/cols)*cols)<=2)) ) ) && <Card className={`${classesMterial.card} ${classes.Fandom} ${classes.Dummy}`} />}

                </GridList>
            </div>
                  {/* { props.fandoms.map(fandom=>(
                      <div className={classes.Fandom} key={fandom.FandomName}>
                          <section className={classes.ImageSection}>
                              {
                                  fandom.Image_Name !== '' 
                                  ? <Link to={`/fanfics/${fandom.FandomName}`}>
                                        <img src={`/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Image_Name}`} alt={fandom.FandomName}/>
                                    </Link> 
                                  
                                  : <Link to={`/fandom/${fandom.FandomName}`}>
                                        <img src={`/fandoms/nophoto.png`} alt={fandom.FandomName} className={classes.NoImage}/> 
                                    </Link>
                              }
                          </section>
                            <section className={classes.DataSection}>
                                <Link to={`/fanfics/${fandom.FandomName}`}>
                                    <h3>{fandom.FandomName}</h3>         
                                    <p><span>Fanfics in Fandoms: </span><b>{fandom.FanficsInFandom}</b></p>           
                                    <p><span>Complete Fanfics: </span>{fandom.CompleteFanfics}</p> 
                                    <p><span>In Progress Fanfics: </span>{fandom.OnGoingFanfics}</p>                            
                                </Link>
                            </section>

                      </div>
                  ))}
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                 </div> */}
        </React.Fragment>  
    )
};

export default ShowFandomData;