import React from 'react';
import Button from '@material-ui/core/Button';
import { Grid, Checkbox, FormGroup, FormControlLabel } from '@material-ui/core';



const GridButtons = (props) => {
    return props.showBox &&
        <Grid className='grid_buttons' item xs={6}>
            <FormGroup row className="checkbox_sites">
                <FormControlLabel
                    control={<Checkbox checked={props.switches.AO3} onChange={() => props.switchChange('AO3')} name="AO3" value="AO3" color="primary" />}
                    label="AO3" />
                <FormControlLabel
                    control={<Checkbox checked={props.switches.FF} onChange={() => props.switchChange('FF')} name="FF" value="FF" color="primary" />}
                    label="FF" />
            </FormGroup>
            <br />
            <Button variant="contained" onClick={() => props.sendRequestsToServer('getFandomFanficsPartial')}>Get/Update Fanfics - Partial Run</Button>
            <br />
            <Button variant="contained" onClick={() => props.sendRequestsToServer('getFandomFanficsFull')}>Get/Update Fanfics - Full Run</Button>
            <br />
            <Button variant="contained" onClick={() => props.sendRequestsToServer('getDeletedFanfics')}>Get/Update Deleted Fanfics</Button>
            <br />
            <Button variant="contained" onClick={() => props.sendRequestsToServer('updateFandomNumbers')}>Update Numbers Of Fandom</Button>
            <br />
        </Grid>

};

export default GridButtons;