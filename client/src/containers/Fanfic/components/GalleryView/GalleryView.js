import React,{Component} from 'react';
import classes from './GalleryView.module.scss';
import ImageZoom from 'react-medium-image-zoom';
import Truncate from 'react-truncate';
import { Grid, Card, CardContent, Typography } from '@material-ui/core'
import {getRandomColor} from '../../../../utils/sharedFunctions';
import ShowFullData from './ShowFullData/ShowFullData'
import Chip from '@material-ui/core/Chip';
class GalleryView extends Component{  
    state = {
        imageColor: [],
        zoom:null
    }

    componentDidMount(){
        const length = 16;
        console.log('length is:',length)
        let imageColor = [];
        for (let index = 0; index<length; index++) {
            const color = getRandomColor();
            imageColor.push(color)
        }
        this.setState({imageColor})
        
    }

    render(){
        const {fanfics} = this.props;
        const {imageColor,zoom} = this.state;

        return(
            <Grid container className={classes.root} spacing={1}>

                <Grid container justify="center" spacing={1}>
                    {fanfics.map( (fanfic,index) => {
                        let isImage = fanfic.image&&fanfic.image !== '' ? true : false;
                        let complete = fanfic.Complete===true ? true : false;
                        let oneshot = fanfic.Oneshot===true ? true : false;
                        let source = ( (fanfic.Source==='AO3' && fanfic.Deleted===true) || fanfic.Source==='Backup') ? 'Backup' : fanfic.Source;
                        const imgLink = isImage   ? `/fandoms/${fanfic.FandomName.toLowerCase()}/fanficsImages/${fanfic.image}`
                        : `/fandoms/${fanfic.FandomName.toLowerCase()}/fanfic_general.jpg`;
                        return (
                            <Card key={fanfic.FanficTitle} className={classes.card} onClick={()=>this.setState({zoom:fanfic.FanficID})}>
                                <div  style={{backgroundColor:imageColor[index]}} className={isImage ? classes.card_image : classes.card_image_opacity}>
                                    <img src={imgLink} alt={fanfic.FanficTitle} className={classes.cardMedia}/>
                                    {zoom!==null && zoom===fanfic.FanficID &&
                                        <ShowFullData   fanfic={fanfic}
                                                        props={this.props}
                                        />
                                    }
                                    <div className={classes.header}>
                                        <CardContent className={classes.content}>
                                            <Typography component="h5" variant="h5">
                                                {fanfic.FanficTitle}
                                            </Typography>
                                            <Typography component="h6" variant="h6">
                                                {fanfic.Author}
                                            </Typography>
                                        </CardContent>
                                        <div className={classes.stat}>
                                            <span className={`${classes.source} color_${source}`}>{source}</span>
                                            <span className={complete ? classes.complete : classes.inprogress}>{complete ? 'Complete' : 'In progress'}</span>
                                            {oneshot && <span className={classes.oneshot}>Oneshot</span>}
                                        </div>
                                    </div>
        
                                    <div className={classes.details}>
                                        <CardContent className={classes.content}>
                                            <div className={classes.categories}>
                                                {fanfic.Categories.map(category=>
                                                    <Chip size="medium" key={category} label={category} className={classes.category_chip}/>
                                                )}
                                            </div>
                                            <div className={classes.desc}>
                                                <Truncate lines={3} ellipsis={<span>...</span>}>
                                                    <div  dangerouslySetInnerHTML={{ __html:fanfic.Description}}></div>
                                                </Truncate>
                                            </div>
                                        </CardContent>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </Grid> 
            </Grid>
    )}
};

export default GalleryView;