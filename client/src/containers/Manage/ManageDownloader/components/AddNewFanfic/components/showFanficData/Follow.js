import React from 'react';
import Button from '@material-ui/core/Button';

const Follow = (props) => (
    <div  className='userData'>
        <Button  onClick={() =>props.markAs(props.fanfic.FanficID,props.fanfic.FanficTitle,'Follow')}
                color='primary' className={props.userData.Follow ? 'userData_green' : null}>
                    Follow
        </Button> 
    </div>
);

export default Follow;