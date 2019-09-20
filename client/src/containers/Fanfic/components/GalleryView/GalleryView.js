import React from 'react';
import classes from './GalleryView.module.scss'
import ImageZoom from 'react-medium-image-zoom'
import { Grid, Card, CardContent, Typography } from '@material-ui/core'

const GalleryView = (props) => {

    const {fanfics,size} = props;
    let xs = (size==='xm'||size==='m') ? 6 : (size==='xs'||size==='s') ? 10 : 3;
    return(
        <Grid container className={classes.root} spacing={1}>
      {/* <Grid item xs={12}> */}
        <Grid container justify="center" spacing={1}>
            {fanfics.map(fanfic => {
                let isImage = fanfic.image&&fanfic.image !== '' ? true : false;
                let complete = fanfic.Complete===true ? true : false;
                let oneshot = fanfic.Oneshot===true ? true : false;
                let source = ( (fanfic.Source==='AO3' && fanfic.Deleted===true) || fanfic.Source==='Backup') ? 'Backup' : fanfic.Source;
                const imgLink = isImage   ? `/fandoms/${fanfic.FandomName.toLowerCase()}/fanficsImages/${fanfic.image}`
                : `/fandoms/${fanfic.FandomName.toLowerCase()}/fanfic_general.jpg`;
                return (
                    <Card key={fanfic.FanficTitle} className={classes.card}>
                    {/* <Grid key={fanfic.FanficTitle} item xs={xs} className={classes.gridImage}> */}
                        <ImageZoom
                            image={{
                                src: imgLink,
                                alt: fanfic.FanficTitle,
                                className: classes.cardMedia,
                            }}
                        />
                        <div className={classes.header}>
                            <CardContent className={classes.content}>
                                <Typography component="h5" variant="h5">
                                    {fanfic.FanficTitle}
                                </Typography>
                                <Typography component="h6" variant="h6">
                                    {fanfic.Author}
                                </Typography>
                            </CardContent>
                        </div>
                        <div className={classes.stat}>
                            <span className={classes.source}>{source}</span>
                            <span className={complete ? classes.complete : classes.inprogress}>{complete ? 'Complete' : 'In progress'}</span>
                            {oneshot && <span className={classes.oneshot}>Oneshot</span>}
                        </div>
                        <div className={classes.details}>
                            <CardContent className={classes.content}>
                                <h4>{fanfic.FanficTitle}</h4>
                                <h5>{fanfic.Author}</h5>
                            </CardContent>
                        </div>
                    {/* </Grid> */}
                    </Card>
                )
            })}
        </Grid>
      {/* </Grid> */}
    </Grid>
    //     <div className={classes.root}>
    //     <GridList cellHeight={300} className={classes.gridList}>
    //       <GridListTile key="Subheader" cols={3} style={{ height: 'auto' }}>
    //         <ListSubheader component="div">December</ListSubheader>
    //       </GridListTile>
    //         {fanfics.map(fanfic => {
    //             let isImage = fanfic.image&&fanfic.image !== '' ? true : false;
    //             return (
    //                 <GridListTile key={fanfic.FanficTitle}>
    //                 <img src={isImage ? `/fandoms/${fanfic.FandomName.toLowerCase()}/fanficsImages/${fanfic.image}`
    //                                   : `/fandoms/${fanfic.FandomName.toLowerCase()}/fanfic_general.jpg` } 
    //                           alt={fanfic.FanficTitle} />
                
    //             {/* <GridListTileBar
    //                 title={tile.title}
    //                 subtitle={<span>by: {tile.author}</span>}
    //                 actionIcon={
    //                 <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
    //                     <InfoIcon />
    //                 </IconButton>
    //                 }
    //             />*/}
    //             </GridListTile> 
    //             )
    //         })}
    //     </GridList>
    //   </div>
    )
};

export default GalleryView;