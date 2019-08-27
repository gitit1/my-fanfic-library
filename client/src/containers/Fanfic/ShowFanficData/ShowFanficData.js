import React from 'react';
import './showFandomData.scss'

import MarkAsRead from '../../../assets/images/icons/markAsRead.svg'
import MarkedAsRead from '../../../assets/images/icons/markedAsRead.svg'

import * as functions from './functions';

import UserHeader from './UserHeader/UserHeader'
import Header from './Header/Header'
import Tags from './Tags/Tags'
import Desc from './Desc/Desc'
import Stat from './Stat/Stat'

import GridList from '@material-ui/core/GridList';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';



const ShowFanficData = (props) => {
    const {fanfics,isManager} = props;
    return(
        <React.Fragment>
            <div className='root' style={{width:'100%'}}>
                <GridList cellHeight='auto' className='grid_list' cols={1}>
                    { fanfics.map(fanfic=>{
                        let userData = props.userFanfics.filter( userFanfic => {return userFanfic.FanficID === fanfic.FanficID})
                        userData = userData.length!==0 ? Object.values(userData)[0]: null;
                        const redClasses    =   functions.redClassesHandler()
                        const greenClasses  =   functions.greenClassesHandler()
                        const isFavorite    =   functions.favoriteFilter(userData,redClasses)    
                        const isFollowed    =   functions.followFilter(userData,greenClasses,MarkedAsRead,MarkAsRead)    
                        const isFinished    =   functions.finishedFilter(userData,greenClasses,MarkedAsRead,MarkAsRead)
                        const isInProgress  =   functions.inProgressFilter(userData,greenClasses,isFinished[0],MarkedAsRead,MarkAsRead)
                        const isIgnored     =   functions.ignoreFilter(userData,redClasses)
                        const inReadingList =   functions.readingListFilter(userData)
                        return(
                            <Card className='card'  key={fanfic.FanficID}>
                                <CardContent className='card_content'>                           
                                    <section className='card_content_header'>
                                        <Header fanfic={fanfic} size={props.size} showTagsToggle={props.showTagsToggle} showTags={props.showTags}/>
                                    </section>
                                    <section className='card_content_tags'>
                                        <Tags fanfic={fanfic} size={props.size} showTags={props.showTags}/> 
                                    </section>
                                    <section className='card_content_desc'>
                                        <Desc fanfic={fanfic}/>                        
                                    </section>
                                    <section className='card_content_stat'>
                                        <Stat fanfic={fanfic}/> 
                                    </section>
                                    { props.isAuthenticated &&
                                        <section className='card_content_userData'>
                                            <UserHeader props={props} 
                                                        fanfic={fanfic}
                                                        redClasses={redClasses}
                                                        userData={userData}
                                                        greenClasses={greenClasses} 
                                                        isFollowed={isFollowed}
                                                        isFavorite={isFavorite}
                                                        isFinished={isFinished}
                                                        isInProgress={isInProgress}
                                                        isIgnored={isIgnored}
                                                        inReadingList={inReadingList}
                                                        isManager={isManager}
                                            />
                                        </section>

                                    }
                                </CardContent>
                            </Card>
                        )
                    }) }
                </GridList>
            </div>
        </React.Fragment>
    )
};

export default ShowFanficData;

/* 
TODO: Reading List: 
    first step - just general to make it work
    when click - modal ask where to save - general or create new list (per user...) , 
    in filter - add filter between deffrent reading lists
 TODO: if mark as finished is marked - disable mark in progress
 TODO: <span>options to create reading lists (one shot ... if not created - save to general)</span>
 TODO: <span>is saved? and how</span> 
 TODO: Add user tage - add/edir/delete 
 TODO: <span>add image</span> 
 TODO: <span>hiatus</span> 
 TODO: <span>page filters (order by: fav,date(asc,dsc),words.....)</span> 
 TODO: <span>save individual fanfics from ff - later</span> 
 TODO: Source filter 
 TODO: deleted indication 
 TODO: in manage - add single fanfiction - to chosen fandon - with choise of source
 TODO: add and save fanfics from ff.net
 TODO: add and save fanfics from wattpad 
 TODO: <span>add from backup (upload epub/mobi/pdf...) - later</span> 
 */