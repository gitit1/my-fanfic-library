import React from 'react';
import ReactSVG from 'react-svg'

const Follow = (props) => (
    <div onClick={() =>props.props.markAs(props.fanfic.FanficID,'Follow',props.isFollowed[3])} className={props.isFollowed[0]}>
    <ReactSVG src={props.isFollowed[4]} className={props.isFollowed[1]} wrapper='span' alt='Follow'  title='Follow' />
    <span className={props.isFollowed[2]}>{props.isFollowed[5] ? 'Following' : 'Follow'}</span>                                
</div>
);

export default Follow;