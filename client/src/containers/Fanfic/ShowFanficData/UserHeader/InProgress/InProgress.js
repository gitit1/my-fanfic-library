import React from 'react';
// import ReactSVG from 'react-svg';
import classes from '../../ShowFanficData.module.css';
import Button from '@material-ui/core/Button';


const InProgress = (props) => (
    <React.Fragment>
        <div  className={props.isInProgress[0]}>
            <Button onClick={() =>props.props.inputChapterToggle(props.fanfic.FanficID)}
                    color='primary' className={props.isInProgress[1] ? 'userData_green' : null}>
                    {props.isInProgress[1] ? `In Progress - Chapter ${props.userData.ChapterStatus}`  : 'Mark in Progress'}
            </Button> 
        </div> 
        {(props.props.inputChapter===props.fanfic.FanficID) &&
            <div className='userData'>
                <input  type="number" 
                        placeholder={props.isInProgress[1] 
                            ? props.userData.ChapterStatus 
                            : 'Number of Chapter'} 
                        onKeyDown={(event)=>props.props.markStatus(props.fanfic.FanficID,'In Progress',props.isInProgress[4],event)}
                />                                
            </div>
        }
    </React.Fragment>
);

export default InProgress;  

/*
        <div onClick={() =>props.props.inputChapterToggle(props.fanfic.FanficID)} 
             className={props.isInProgress[3]}>           
            <ReactSVG   src={props.isInProgress[4]} 
                        className={props.isInProgress[2]} 
                        wrapper='span' 
                        alt='Mark in Progress'  
                        title='Mark in Progress' />
            
            <span className={classes.IconLabel}>
                {(props.isInProgress[0]&& !(props.props.inputChapter===props.fanfic.FanficID)) 
                    ? `In Progress - Chapter ${props.userData.ChapterStatus}` 
                    : 'Mark in Progress'
                }
            </span>
        </div>
        {(props.props.inputChapter===props.fanfic.FanficID) &&
            <div className={classes.UserData}>
                <input  type="number" 
                        placeholder={props.isInProgress[0] 
                            ? props.userData.ChapterStatus 
                            : 'Chapter'} 
                        onKeyDown={(event)=>props.props.markStatus(props.fanfic.FanficID,'In Progress',props.isInProgress[5],event)}
                />                                
            </div>
        }

*/

//  TODO: need to add cancellation to FINISHED/IN PROGRESS