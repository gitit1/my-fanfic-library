import React from 'react';
import Button from '@material-ui/core/Button';

const Follow = (props) => {
    const {FanficID,Author,FanficTitle} = props.fanfic;
    const {Follow} = props.userData;
    return(
        <div  className='userData'>
        <Button  onClick={() =>props.markAs(FanficID,Author,FanficTitle,'Follow')}
                color='primary' className={Follow ? 'userData_green' : null}>
                    Follow
        </Button> 
        </div> 
    )
};

export default Follow;