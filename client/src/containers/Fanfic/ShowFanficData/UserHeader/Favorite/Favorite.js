import React from 'react';
import ReactSVG from 'react-svg'
import FavoriteSvg from '../../../../../assets/images/icons/favorite.svg'

const Favorite = (props) => (
    <div onClick={() =>props.props.markAs(props.fanfic.FanficID,'Favorite',props.isFavorite[3])} className={props.isFavorite[0]}>
    <ReactSVG src={FavoriteSvg} className={props.isFavorite[1]} wrapper='span' alt='Favorite'  title='Favorite' />
    <span className={props.isFavorite[2]}>Favorite</span>                                
</div>
);

export default Favorite;