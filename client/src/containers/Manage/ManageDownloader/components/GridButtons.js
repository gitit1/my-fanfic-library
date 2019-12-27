import React from 'react';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';



const GridButtons = (props) => {
    return props.showBox &&
            <Grid className='grid_buttons' item xs={6}>
                <Button variant="contained" onClick={()=>props.sendRequestsToServer('getFandomFanficsPartial')}>Get/Update Fanfics - Partial Run</Button>
                <br/>
                <Button variant="contained" onClick={()=>props.sendRequestsToServer('getFandomFanficsFull')}>Get/Update Fanfics - Full Run</Button>
                <br/>
                <Button variant="contained" onClick={()=>props.sendRequestsToServer('getDeletedFanfics')}>Get/Update Deleted Fanfics</Button>  
                <br/>
                {/* <Button variant="contained" onClick={()=>props.addNewFanfic()}>Add New Fanfic</Button>
                <br/> */}
                <Button variant="contained" onClick={()=>props.sendRequestsToServer('checkIfFileExsists')}>Save Missing Fanfics</Button>
                <br/>
            </Grid>
    
};

export default GridButtons;