import React from 'react';
import Button from '@material-ui/core/Button';

const Delete = (props) => {
    // const {isIgnored} = props;
    const {markAs} = props.props;
    const {FanficID,Author,FanficTitle,Source} = props.fanfic;
 
    return(
       <div className='userData'>
          <Button  onClick={() =>markAs(FanficID,Author,FanficTitle,Source,'Delete')} 
                   color='primary' className='userData_red'>
                      DELETE FROM SERVER                   
          </Button>                                
       </div>
    )
 };
 
 
 
 export default Delete;