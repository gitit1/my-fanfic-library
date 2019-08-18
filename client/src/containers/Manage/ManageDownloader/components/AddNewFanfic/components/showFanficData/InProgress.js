import React from 'react';
import Button from '@material-ui/core/Button';

const InProgress = (props) => (
    <div className='userData'>      
        <Button onClick={() =>props.toggleChapterB()}
                color='primary' className={props.userData.status==='In Progress' ? 'userData_green' : null}>
            {props.userData.status==='In Progress' ? `In Progress - Chapter ${props.userData.chapter}`  : 'Mark in Progress'}
        </Button> 
        {props.userData.toggleChpter &&
            <div className='userData'>
                <input  type="number" 
                        placeholder={props.userData.status==='In Progress' ? props.userData.chapter : 'Number of Chapter'} 
                        onKeyDown={(event)=>props.markStatus(props.fanfic.FanficID,'In Progress',event)}
                />                                
            </div>
        }
    </div>  
);

export default InProgress;