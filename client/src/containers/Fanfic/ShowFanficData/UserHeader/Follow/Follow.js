import React from 'react';
// import ReactSVG from 'react-svg'

import Button from '@material-ui/core/Button';

const Follow = (props) => (
   <div  className={props.isFollowed[0]}>
      <Button  onClick={() =>props.props.markAs(props.fanfic.FanficID,'Follow',props.isFollowed[1])}
               color='primary' className={props.isFollowed[2] ? 'userData_green' : null}>
                  {props.isFollowed[2] ? 'Following' : 'Follow'}
      </Button>                                
   </div>

);

export default Follow;


   //   <div onClick={() =>props.props.markAs(props.fanfic.FanficID,'Follow',props.isFollowed[3])} className={props.isFollowed[0]}>
   //  {/* <ReactSVG src={props.isFollowed[4]} className={props.isFollowed[1]} wrapper='span' alt='Follow'  title='Follow' /> */}
   //   {/* <span className={props.isFollowed[2]}>{props.isFollowed[5] ? 'Following' : 'Follow'}</span> */}
   //   <Button color="primary">Follow</Button>                                
   //   </div>

