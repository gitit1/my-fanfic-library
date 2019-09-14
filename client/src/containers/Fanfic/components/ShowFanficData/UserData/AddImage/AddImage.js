import React from 'react';
import Button from '@material-ui/core/Button';

const AddImage = (props) => {
    const {addImageToggle} = props.images
    return(
        <div className='userData'>
            <Button color='primary' onClick={()=>addImageToggle(props.fanfic.FanficID)}>
                    Add Image
            </Button> 
        </div>
    )
};

export default AddImage;
