import React from 'react';
import Button from '@material-ui/core/Button';

const Finished = (props) => {
        const {FanficID,Author,FanficTitle,Source} = props.fanfic;
        const {status} = props.userData;
        const {markStatus} = props;
        return(
            <div  className='userData'>      
                <Button onClick={() =>markStatus(FanficID,Author,FanficTitle,Source,'Finished')}
                        color='primary' className={status==='Finished' ? 'userData_green' : null}>
                    Finished
                </Button> 
            </div>
        ) 
};

export default Finished;