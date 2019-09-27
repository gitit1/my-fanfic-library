import React from 'react';
import classes from  '../../MyStatistics.module.scss';

const GeneralAllFandomData = (props) => {
    const {data} = props;
    let finishedCounter     =   data.reduce(function (r, a) {return r +  a.Finished ;}, 0);
    let inProgressCounter   =   data.reduce(function (r, a) {return r +  a['In Progress'] ;}, 0);
    let favoriteCounter     =   data.reduce(function (r, a) {return r +  a.Favorite ;}, 0);
    let ignoredCounter      =   data.reduce(function (r, a) {return r +  a.Ignored ;}, 0);
    let followCounter       =   data.reduce(function (r, a) {return r +  a.Follow ;}, 0);
    
    return(
        <div className={classes.GeneralAllFandomData}>
            <div>
                <h4>Total Count:</h4>
                <p className={classes.Finished}>Finished:    <span>{finishedCounter}</span></p>
                <p className={classes.InProgress}>In Progress: <span>{inProgressCounter}</span></p>
                <p className={classes.Favorite}>Favorite:    <span>{favoriteCounter}</span></p>
                <p className={classes.Ignored}>Ignored:     <span>{ignoredCounter}</span></p>
                <p className={classes.Following}>Followed:     <span>{followCounter}</span></p>
            </div>
        </div>
    )
};

export default GeneralAllFandomData;