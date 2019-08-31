import React from 'react';

// import ReadingList from './ReadingList';
import Follow from './Follow/Follow';
import Favorite from './Favorite/Favorite';
import Finished from './Finished/Finished';
import InProgress from './InProgress/InProgress';
import Ignore from './Ignore/Ignore';
import SavedFile from './SavedFile/SavedFile'
import AddCategories from './AddCategories/AddCategories'


const UserHeader = (props) => (
  <React.Fragment> 
      {/*TODO: reading list  */}
    {/* <ReadingList  props={props.props} inReadingList={props.inReadingList} fanfic={props.fanfic}/> */}
    <Follow           props={props.props} isFollowed={props.isFollowed} fanfic={props.fanfic}/>
    <Favorite         props={props.props} isFavorite={props.isFavorite} fanfic={props.fanfic}/>
    <Finished         props={props.props} isFinished={props.isFinished} isInProgress={props.isInProgress} fanfic={props.fanfic}/>
    <InProgress       props={props.props} userData={props.userData} isInProgress={props.isInProgress} fanfic={props.fanfic} />
    <Ignore           props={props.props} isIgnored={props.isIgnored} fanfic={props.fanfic} />    
    {props.isManager && 
    <React.Fragment>
      <AddCategories  fanfic={props.fanfic} showCategory={props.showCategory} showSelectCategory={props.showSelectCategory} saveCategories={props.saveCategories}/>    
      <SavedFile      fanfic={props.fanfic}/>
    </React.Fragment>
    }
  </React.Fragment>
);

export default UserHeader;