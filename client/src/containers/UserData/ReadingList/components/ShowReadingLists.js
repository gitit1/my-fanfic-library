import React from 'react';
import { Link } from 'react-router-dom';

import classes from '../ReadingList.module.scss';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import ReadingListImage from './ReadingListImage'

const ShowReadingLists = (props) => {
    const { readingLists, userEmail, imageFlag, imageRlID } = props;
    console.log('readingLists:', readingLists)
    return (
        readingLists.length > 0 &&
        <div className={classes.ReadingList}>
            {readingLists.map(rl => (
                // add link to see them all (needs funcionality)
                <Card className={classes.ReadingListCard} key={rl.Name}>
                    <ReadingListImage readingList={rl} userEmail={userEmail} imageFlag={imageFlag} imageRlID={imageRlID} className={classes.ReadingListLink} />
                    <CardContent className={classes.CardContent}>
                        <Link to={`/fanfics/${rl.Name}?list=true`}>
                            <Typography gutterBottom variant="h5" component="h5" className={classes.cardHeader}>
                                {rl.Name}
                            </Typography>
                            <p>Number of Fanfics:   <span>{rl.Fanfics.length}</span></p>
                        </Link>
                        <Button variant="contained" className={classes.Buttons} onClick={() => props.toggleImage(rl.Name)}>Add/Edit Image</Button>
                        <Button variant="contained" className={classes.Buttons} onClick={() => props.goToFanfics(rl.Name)}>See Fanfics</Button>
                        <Button variant="contained" className={classes.Buttons} onClick={() => props.deleteReadingList(rl.Name)}>Delete</Button>
                    </CardContent>
                </Card>

            ))

            }
        </div>
    )
};

export default ShowReadingLists;