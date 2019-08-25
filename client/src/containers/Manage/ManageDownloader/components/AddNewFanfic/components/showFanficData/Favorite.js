import React from 'react';
import Button from '@material-ui/core/Button';

const Favorite = (props) => {
    const {FanficID,Author,FanficTitle} = props.fanfic;
    const {Favorite} = props.userData;
    return(
        <div  className='userData'>
            <Button  onClick={() =>props.markAs(FanficID,Author,FanficTitle,'Favorite')}
                    color='primary' className={Favorite ? 'userData_green' : null}>
                        Favorite
            </Button> 
        </div>  
    )
};

export default Favorite;