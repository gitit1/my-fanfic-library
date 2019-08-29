import React from 'react';
import Button from '@material-ui/core/Button';

const InProgress = (props) => {
    const {FanficID,Author,FanficTitle,Source} = props.fanfic;
    const {status,chapter,toggleChpter} = props.userData;
    const {markStatus,toggleChapterB} = props;
    return(
        <div className='userData'>      
            <Button onClick={() =>toggleChapterB()}
                    color='primary' className={status==='In Progress' ? 'userData_green' : null}>
                {status==='In Progress' ? `In Progress - Chapter ${chapter}`  : 'Mark in Progress'}
            </Button> 
            {toggleChpter &&
                <div className='userData'>
                    <input  type="number" 
                            placeholder={status==='In Progress' ? chapter : 'Number of Chapter'} 
                            onKeyDown={(event)=>markStatus(FanficID,Author,FanficTitle,Source,'In Progress',event)}
                    />                                
                </div>
            }
        </div> 
    ) 
};

export default InProgress;