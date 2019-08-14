import React from 'react';
import Typography from '@material-ui/core/Typography';

const Desc = (props) => (
    <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{ __html:props.fanfic.Description}}></Typography>  
);

export default Desc;