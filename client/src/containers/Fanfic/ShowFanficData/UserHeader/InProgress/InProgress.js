import React from 'react';
import Button from '@material-ui/core/Button';


const InProgress = (props) => {
    const {isInProgress,userData} = props;
    const {inputChapter,inputChapterToggle,markStatus} = props.props;
    const {FanficID,Author,FanficTitle,Source} = props.fanfic;
 
    return(
        <React.Fragment>
            <div  className={isInProgress[0]}>
                <Button onClick={() =>inputChapterToggle(FanficID)}
                        color='primary' className={isInProgress[1] ? 'userData_green' : null}>
                        {isInProgress[1] ? `In Progress - Chapter ${userData.ChapterStatus}`  : 'Mark in Progress'}
                </Button> 
            </div> 
            {(inputChapter===FanficID) &&
                <div className='userData'>
                    <input  type="number" 
                            placeholder={props.isInProgress[1] 
                                ? props.userData.ChapterStatus 
                                : 'Chapter'} 
                            onKeyDown={(event)=>markStatus(FanficID,Author,FanficTitle,Source,'In Progress',isInProgress[4],event)}
                    />                                
                </div>
            }
        </React.Fragment>
    );
};

export default InProgress;  

//  TODO: need to add cancellation to FINISHED/IN PROGRESS