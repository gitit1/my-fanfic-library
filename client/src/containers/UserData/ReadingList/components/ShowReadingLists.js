import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import classes from '../ReadingList.module.scss';

const ShowReadingLists = (props) => {
    const {readingLists,userEmail} = props;
    console.log('readingLists:',readingLists)
    return(
        readingLists.length>0 &&
        <div>
            {readingLists.map(rl=>(
                // add link to see them all (needs funcionality)
                <Card className={classes.ReadingListCard} key={rl.Name} >
                    <CardMedia  className={classes.ReadingListCardImage}
                        image={rl.image !== null 
                                ? `/users/${userEmail}/readingList/${rl.image}`
                                : `/fandoms/nophoto.png`
                        } 
                        title={rl.Name}/>
                    <CardContent className={classes.CardContent}>
                        <Typography gutterBottom variant="h5" component="h5" className={classes.cardHeader}>                                                   
                            {rl.Name}
                        </Typography>
                        <p>Number of Fanfics:   <span>{rl.Fanfics.length}</span></p> 
                    </CardContent>
                </Card>
            ))
    
            }
        </div>
    )
};

export default ShowReadingLists;