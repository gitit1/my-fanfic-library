import React from 'react';
import Button from '@material-ui/core/Button';

const Finished = (props) => (
    <div  className='userData'>      
        <Button onClick={() =>props.markStatus(props.fanfic.FanficID,'Finished')}
                color='primary' className={props.userData.status==='Finished' ? 'userData_green' : null}>
            Finished
        </Button> 
    </div>  
);

export default Finished;