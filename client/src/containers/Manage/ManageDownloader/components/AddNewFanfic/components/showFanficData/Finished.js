import React from 'react';
import Button from '@material-ui/core/Button';

const Finished = (props) => {
        const {FanficID,Author,FanficTitle} = props.fanfic;
        const {status} = props.userData;
        return(
            <div  className='userData'>      
                <Button onClick={() =>props.markStatus(FanficID,Author,FanficTitle,'Finished')}
                        color='primary' className={status==='Finished' ? 'userData_green' : null}>
                    Finished
                </Button> 
            </div>
        ) 
};

export default Finished;