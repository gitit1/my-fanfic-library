import React from 'react';

const Desc = (props) => (
    <div dangerouslySetInnerHTML={{ __html:props.fanfic.Description}}></div>  
);

export default Desc;