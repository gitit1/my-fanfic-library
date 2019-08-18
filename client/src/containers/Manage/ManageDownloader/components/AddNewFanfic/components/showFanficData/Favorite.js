import React from 'react';
import Button from '@material-ui/core/Button';

const Favorite = (props) => (
    <div  className='userData'>
        <Button  onClick={() =>props.markAs(props.fanfic.FanficID,'Favorite')}
                color='primary' className={props.userData.Favorite ? 'userData_green' : null}>
                    Favorite
        </Button> 
    </div>  
);

export default Favorite;