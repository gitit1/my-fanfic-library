import React from 'react';
import Button from '@material-ui/core/Button';

const AddCategories = (props) => {
    const {showCategory,fanfic} = props;

    return(
        <div className='userData'>
            <Button  onClick={() =>showCategory(fanfic.FanficID)} color='primary' >Add Categories</Button>                                
        </div>
    )
};

export default AddCategories;