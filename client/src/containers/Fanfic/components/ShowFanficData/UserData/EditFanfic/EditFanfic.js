import React from 'react';
import Button from '@material-ui/core/Button';

const EditFanfic = (props) => {

    const {editFanficToggle} = props.props;

 
    return(
       <div className='userData'>
          <Button  onClick={() =>editFanficToggle(props.fanfic,false)} 
                   color='primary' className='userData_red'>
                      Edit Fanfic                  
          </Button>                                
       </div>
    )
 };
 
 
 
 export default EditFanfic;