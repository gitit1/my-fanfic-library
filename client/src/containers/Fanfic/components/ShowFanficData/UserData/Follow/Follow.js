import React from 'react';
import Button from '@material-ui/core/Button';

const Follow = (props) => {
   const {isFollowed} = props;
   const {markAs} = props.props;
   const {FanficID,Author,FanficTitle,Source} = props.fanfic;

   return(
      <div  className={isFollowed[0]}>
         <Button  onClick={() =>markAs(FanficID,Author,FanficTitle,Source,'Follow',isFollowed[1])}
                  color='primary' className={isFollowed[2] ? 'userData_green' : null}>
                     {isFollowed[2] ? 'Following' : 'Follow'}
         </Button>                                
      </div>
   )
};

export default Follow;
