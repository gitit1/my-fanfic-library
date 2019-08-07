import React from 'react';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

const GridButtons = (props) => (
    <Grid className='grid_buttons' item xs={6}>
        <Button variant="contained" onClick={()=>props.sendRequestsToServer('getFandomFanfics')}>Get/Update Fanfics</Button>
        <br/>
        <Button variant="contained" onClick={()=>props.sendRequestsToServer('getDeletedFanfics')}>Get/Update Deleted Fanfics</Button>  
        <br/>
        <Button variant="contained" onClick={()=>props.addNewFanfic()}>Add New Fanfic</Button>
        <br/>
    </Grid>
);

export default GridButtons;