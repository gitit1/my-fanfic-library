import React from 'react';
import Button from '@material-ui/core/Button';

const Follow = (props) => {
    const {FanficID,Author,FanficTitle,Source} = props.fanfic;
    const {Follow} = props.userData;
    const {markAs} = props;
    return(
        <div  className='userData'>
        <Button  onClick={() =>markAs(FanficID,Author,FanficTitle,Source,'Follow')}
                color='primary' className={Follow ? 'userData_green' : null}>
                    Follow
        </Button> 
        </div> 
    )
};

export default Follow;