import React from 'react';
import Button from '@material-ui/core/Button';

const Ignore = (props) => {
   const {isIgnored} = props;
   const {markAs} = props.props;
   const {FanficID,Author,FanficTitle,Source} = props.fanfic;

   return(
      <div  className={isIgnored[0]}>
         <Button  onClick={() =>markAs(FanficID,Author,FanficTitle,Source,'Ignore',isIgnored[1])} 
                  color='primary' className={isIgnored[2] ? 'userData_red' : null}>
                     {!isIgnored[2] ? 'Ignore' : 'Unignore'}
                     
         </Button>                                
      </div>
   )
};



export default Ignore;