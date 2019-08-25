import React from 'react';
// import ReactSVG from 'react-svg'
// import FavoriteSvg from '../../../../../assets/images/icons/favorite.svg'
import Button from '@material-ui/core/Button';

const Favorite = (props) => (
    <div  className={props.isFavorite[0]}>
        <Button onClick={() =>props.props.markAs(props.fanfic.FanficID,props.fanfic.Author,props.fanfic.FanficTitle,'Favorite',props.isFavorite[1])}
                color='primary' className={props.isFavorite[2] ? 'userData_red' : null}>
                Favorite
        </Button> 
    </div>
);

export default Favorite;

/*
    <div onClick={() =>props.props.markAs(props.fanfic.FanficID,'Favorite',props.isFavorite[3])} className={props.isFavorite[0]}>
        <ReactSVG src={FavoriteSvg} className={props.isFavorite[1]} wrapper='span' alt='Favorite'  title='Favorite' />
        <span className={props.isFavorite[2]}>Favorite</span>                                
    </div>
 */