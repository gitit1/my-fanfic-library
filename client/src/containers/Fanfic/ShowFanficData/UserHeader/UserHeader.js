import React from 'react';

// import ReadingList from './ReadingList';
import Follow from './Follow/Follow';
import Favorite from './Favorite/Favorite';
import Finished from './Finished/Finished';
import InProgress from './InProgress/InProgress';
import Ignore from './Ignore/Ignore';



const UserHeader = (props) => (
  <React.Fragment> 
      {/*TODO: reading list  */}
    {/* <ReadingList  props={props.props} inReadingList={props.inReadingList} fanfic={props.fanfic}/> */}
    <Follow       props={props.props} isFollowed={props.isFollowed} fanfic={props.fanfic}/>
    <Favorite     props={props.props} isFavorite={props.isFavorite} fanfic={props.fanfic}/>
    <Finished     props={props.props} isFinished={props.isFinished} isInProgress={props.isInProgress} fanfic={props.fanfic}/>
    <InProgress   props={props.props} userData={props.userData} isInProgress={props.isInProgress} fanfic={props.fanfic} />
    <Ignore       props={props.props} isIgnored={props.isIgnored} fanfic={props.fanfic} />    
  </React.Fragment>
);

export default UserHeader;