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
import AddImage from './AddImage/AddImage'
import ReadingList from './ReadingList/ReadingList'
import Delete from './Delete/Delete'
import EditFanfic from './EditFanfic/EditFanfic'

const UserData = (props) => {
  const {fanfic,showCategory,showSelectCategory,saveCategories,userFanfics,readingLists,showMnagerButtonsSwitch,rlMode} = props;
  let userData = userFanfics.filter( userFanfic => {return userFanfic.FanficID === fanfic.FanficID})
  userData = userData.length!==0 ? Object.values(userData)[0]: null;
  const isFollowed    =   functions.followFilter(userData)    
  const isFavorite    =   functions.favoriteFilter(userData)    
  const isFinished    =   functions.finishedFilter(userData)
  const isInProgress  =   functions.inProgressFilter(userData,isFinished[0])
  const isIgnored     =   functions.ignoreFilter(userData)
  const isDeleted     =   (fanfic.Deleted===true) ? true : false
  const isBackup     =    (fanfic.Source==='Backup'||fanfic.Source==='Wattpad'||fanfic.Source==='Patreon'||fanfic.Source==='Tumblr') ? true : false
  // const inReadingList =   functions.readingListFilter(userData)

  return(
    <section>
      {props.isManager && showMnagerButtonsSwitch && 
        <AddCategories  fanfic={fanfic} showCategory={showCategory} showSelectCategory={showSelectCategory} saveCategories={saveCategories}/>   
      }
      {props.isManager && showMnagerButtonsSwitch && 
        <AddImage       fanfic={fanfic} images={props.images}/>   
      }
      <ReadingList      props={props.props} userData={userData} fanfic={props.fanfic} readingLists={readingLists} rlMode={rlMode}/>
      <Follow           props={props.props} isFollowed={isFollowed} fanfic={fanfic}/>
      <Favorite         props={props.props} isFavorite={isFavorite} fanfic={fanfic}/>
      <Finished         props={props.props} isFinished={isFinished} isInProgress={isInProgress} fanfic={fanfic}/>
      <InProgress       props={props.props} userData={userData} isInProgress={isInProgress} fanfic={fanfic} />
      <Ignore           props={props.props} isIgnored={isIgnored} fanfic={fanfic} />  
      {props.isManager && isDeleted      &&  <Delete     props={props.props} fanfic={fanfic}/>}  
      {props.isManager && isBackup      &&   <EditFanfic props={props.props} fanfic={fanfic}/>}  
      <SavedFile      fanfic={fanfic}/>
    </section>
  )
};

export default UserData;