import React from 'react';
import ReactSVG from 'react-svg';
import classes from '../../ShowFanficData.module.css';

const InProgress = (props) => (
    <React.Fragment>
    <div onClick={() =>props.props.inputChapterToggle(props.fanfic.FanficID)} className={props.isInProgress[3]}>
        <ReactSVG src={props.isInProgress[4]} className={props.isInProgress[2]} wrapper='span' alt='Mark in Progress'  title='Mark in Progress' />
        <span className={classes.IconLabel}>{(props.isInProgress[0]&& !(props.props.inputChapter===props.fanfic.FanficID)) ? `In Progress - Chapter ${props.userData.ChapterStatus}` : 'Mark in Progress'}</span>
    </div>
    {(props.props.inputChapter===props.fanfic.FanficID) &&
        <div className={classes.UserData}>
            <input type="number" placeholder={props.isInProgress[0] ? props.userData.ChapterStatus : 'Chapter'} onKeyDown={(event)=>props.props.markStatus(props.fanfic.FanficID,'In Progress',props.isInProgress[5],event)}/>                                
        </div>
    }
    </React.Fragment>
);

export default InProgress;  