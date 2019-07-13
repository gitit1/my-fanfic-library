import React from 'react';
import ReactSVG from 'react-svg';
import classes from '../ShowFanficData.module.css';

import Favorite from './Favorite/Favorite';
import Finished from './Finished/Finished';
import InProgress from './InProgress/InProgress';
import Ignore from './Ignore/Ignore';


import ReadingList from '../../../../assets/images/icons/readingList.svg'

const UserHeader = (props) => (
  <React.Fragment>
    <div className={`${classes.ReadingList} ${classes.UserData}`}>
        {/* <Button className={`${classes.button} ${classes.IconLabel}`}> */}
        <ReactSVG src={ReadingList} className={`${classes.ReadingList} ${classes.Icon}`} wrapper='span' alt='Add to Reading List'  title='Add to Reading List' />
        <span className={classes.IconLabel}>Add to Reading List</span>
        {/* Add to Reading List */}
        {/* </Button>                                 */}
    </div>
    
    <Favorite   props={props.props} isFavorite={props.isFavorite} fanfic={props.fanfic}/>
    <Finished   props={props.props} isFinished={props.isFinished} isInProgress={props.isInProgress} fanfic={props.fanfic}/>
    <InProgress props={props.props} userData={props.userData} isInProgress={props.isInProgress} fanfic={props.fanfic} />
    <Ignore     props={props.props} isIgnored={props.isIgnored} fanfic={props.fanfic} />
    

  </React.Fragment>
);

export default UserHeader;