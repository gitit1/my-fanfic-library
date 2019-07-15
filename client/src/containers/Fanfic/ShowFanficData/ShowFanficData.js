import React from 'react';
import classes from './ShowFanficData.module.css';


import MarkAsRead from '../../../assets/images/icons/markAsRead.svg'
import MarkedAsRead from '../../../assets/images/icons/markedAsRead.svg'

import * as functions from './functions';

import UserHeader from './UserHeader/UserHeader'
import Header from './Header/Header'
import Tags from './Tags/Tags'
import Desc from './Desc/Desc'
import Stat from './Stat/Stat'
                            
const ShowFanficData = (props) => {
    return(
        <React.Fragment>
            <div className={classes.Fanfics}>
                { props.fanfics.map(fanfic=>{
                    let userData = props.userFanfics.filter( userFanfic => {return userFanfic.FanficID === fanfic.FanficID})
                    userData = userData.length!==0 ? Object.values(userData)[0]: null;

                    const redClasses    =   functions.redClassesHandler()
                    const greenClasses  =   functions.greenClassesHandler()
                    const isFavorite    =   functions.favoriteFilter(userData,redClasses)    
                    const isFinished    =   functions.finishedFilter(userData,greenClasses,MarkedAsRead,MarkAsRead)
                    const isInProgress  =   functions.inProgressFilter(userData,greenClasses,isFinished[0],MarkedAsRead,MarkAsRead)
                    const isIgnored     =   functions.ignoreFilter(userData,redClasses)

                    return(
                            <div className={classes.Fanfic} key={fanfic.FanficID}>
                            {/* TODO: show only if autinticate */}                         
                                <section className={classes.UserHeader}>
                                    <UserHeader props={props} 
                                                fanfic={fanfic}
                                                redClasses={redClasses}
                                                userData={userData}
                                                greenClasses={greenClasses} 
                                                isFavorite={isFavorite}
                                                isFinished={isFinished}
                                                isInProgress={isInProgress}
                                                isIgnored={isIgnored}
                                    />
                                    {/* TODO: Reading List: 
                                        first step - just general to make it work
                                        when click - modal ask where to save - general or create new list (per user...) , 
                                        in filter - add filter between deffrent reading lists
                                    {/* TODO: if mark as finished is marked - disable mark in progress
                                    {/* TODO: <span>options to create reading lists (one shot ... if not created - save to general)</span>
                                    {/* TODO: <span>is saved? and how</span> */}
                                    {/* TODO: Add user tage - add/edir/delete */}
                                    {/* TODO: <span>add image</span> */}
                                    {/* TODO: <span>hiatus</span> */}
                                    {/* TODO: <span>page filters (order by: fav,date(asc,dsc),words.....)</span> */}
                                    {/* TODO: <span>save individual fanfics from ff - later</span> */}
                                    {/* TODO: Source filter */}
                                    {/* TODO: deleted indication */}
                                    {/* TODO: in manage - add single fanfiction - to chosen fandon - with choise of source*/}
                                    {/* TODO: add and save fanfics from ff.net */}
                                    {/* TODO: add and save fanfics from wattpad */}
                                    {/* TODO: <span>add from backup (upload epub/mobi/pdf...) - later</span> */}
                                </section>
                                <section className={classes.Header}>
                                    <Header fanfic={fanfic}/>
                                </section>
                                <section className={classes.Tags}>
                                    <Tags fanfic={fanfic}/> 
                                </section>
                                <section className={classes.Desc}>
                                    <Desc fanfic={fanfic}/>                        
                                </section>
                                <section className={classes.Stat}>
                                   <Stat fanfic={fanfic}/> 
                                </section>
                            
                        </div>
                    )
                })}

                  {/* <div className={[classes.Dummy,classes.Fandom].join(' ')}></div> */}
                  {/* <div className={[classes.Dummy,classes.Fandom].join(' ')}></div> */}
                 </div>
        </React.Fragment>  
    )
};

export default ShowFanficData;