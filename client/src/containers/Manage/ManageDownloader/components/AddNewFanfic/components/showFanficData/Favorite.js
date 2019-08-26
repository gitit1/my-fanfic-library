import React from 'react';
import Button from '@material-ui/core/Button';

const Favorite = (props) => {
    const {FanficID,Author,FanficTitle,Source} = props.fanfic;
    const {Favorite} = props.userData;
    const {markAs} = props;
    return(
        <div  className='userData'>
            <Button  onClick={() =>markAs(FanficID,Author,FanficTitle,Source,'Favorite')}
                    color='primary' className={Favorite ? 'userData_green' : null}>
                        Favorite
            </Button> 
        </div>  
    )
};

export default Favorite;