import React from 'react';
import Button from '@material-ui/core/Button';

const Favorite = (props) => {
    const {isFavorite} = props;
    const {markAs} = props.props;
    const {FanficID,Author,FanficTitle,Source} = props.fanfic;
    return(
        <div  className={isFavorite[0]}>
            <Button onClick={() =>markAs(FanficID,Author,FanficTitle,Source,'Favorite',isFavorite[1])}
                    color='primary' className={isFavorite[2] ? 'userData_red' : null}>
                    Favorite
            </Button> 
        </div>
    )
};

export default Favorite;
