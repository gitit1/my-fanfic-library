import React from 'react';

import * as functions from './functions';
// import ReadingList from './ReadingList';
import Follow from './Follow/Follow';
import Favorite from './Favorite/Favorite';
import Finished from './Finished/Finished';
import InProgress from './InProgress/InProgress';
import Ignore from './Ignore/Ignore';
import SavedFile from './SavedFile/SavedFile'
import AddCategories from './AddCategories/AddCategories'


const UserData = (props) => {
  const {fanfic,showCategory,showSelectCategory,saveCategories,userFanfics} = props;
  let userData = userFanfics.filter( userFanfic => {return userFanfic.FanficID === fanfic.FanficID})
  userData = userData.length!==0 ? Object.values(userData)[0]: null;
  const isFollowed    =   functions.followFilter(userData)    
  const isFavorite    =   functions.favoriteFilter(userData)    
  const isFinished    =   functions.finishedFilter(userData)
  const isInProgress  =   functions.inProgressFilter(userData,isFinished[0])
  const isIgnored     =   functions.ignoreFilter(userData)
  // const inReadingList =   functions.readingListFilter(userData)

  return(
    <React.Fragment> 
      {/* <ReadingList  props={props.props} inReadingList={props.inReadingList} fanfic={props.fanfic}/> */}
      <Follow           props={props.props} isFollowed={isFollowed} fanfic={fanfic}/>
      <Favorite         props={props.props} isFavorite={isFavorite} fanfic={fanfic}/>
      <Finished         props={props.props} isFinished={isFinished} isInProgress={isInProgress} fanfic={fanfic}/>
      <InProgress       props={props.props} userData={userData} isInProgress={isInProgress} fanfic={fanfic} />
      <Ignore           props={props.props} isIgnored={isIgnored} fanfic={fanfic} />    
      {props.isManager && 
      <React.Fragment>
        <AddCategories  fanfic={fanfic} showCategory={showCategory} showSelectCategory={showSelectCategory} saveCategories={saveCategories}/>    
        <SavedFile      fanfic={fanfic}/>
      </React.Fragment>
      }
    </React.Fragment>
  )
};

export default UserData;