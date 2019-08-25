import React from 'react';
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
                        onKeyDown={(event)=>props.props.markStatus(props.fanfic.FanficID,props.fanfic.Author,props.fanfic.FanficTitle,'In Progress',props.isInProgress[4],event)}
                />                                
            </div>
        }
    </React.Fragment>
);

export default InProgress;  

//  TODO: need to add cancellation to FINISHED/IN PROGRESS