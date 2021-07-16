import React from 'react';
import { Grid, Button, Checkbox, FormGroup, FormControlLabel, TextField } from '@material-ui/core';



const GridButtons = ({ showBox, xs, switches, switchChange, pagesChange, sendRequestsToServer, isAllFandoms }) => {
    return showBox &&
        <Grid className='grid_buttons' item xs={xs}>
            <FormGroup row className="checkbox_sites">
                <FormControlLabel
                    control={<Checkbox checked={switches.AO3} onChange={() => switchChange('AO3')} name="AO3" value="AO3" color="primary" />}
                    label="AO3" />
                <FormControlLabel
                    control={<Checkbox checked={switches.FF} onChange={() => switchChange('FF')} name="FF" value="FF" color="primary" />}
                    label="FF" />

            </FormGroup>
            { (switches.FF || switches.AO3) &&
                <FormGroup className="pages_num">
                    <TextField  id="from_page" label="From" type="number"  onChange={(e) => pagesChange('From', e.target.value)}/>
                    <TextField  id="to_page" label="To" type="number"  onChange={(e) => pagesChange('To', e.target.value)}/>
                </FormGroup>
            }
            <br />
            <Button variant="contained" onClick={() => sendRequestsToServer('getFandomFanficsPartial')}>Get/Update Fanfics - Partial Run</Button>
            <br />
            <Button variant="contained" onClick={() => sendRequestsToServer('getFandomFanficsFull')}>Get/Update Fanfics - Full Run</Button>
            <br />
            <Button variant="contained" onClick={() => sendRequestsToServer('getDeletedFanfics')}>Get/Update Deleted Fanfics</Button>
            <br />
            <Button variant="contained" onClick={() => sendRequestsToServer('updateFandomNumbers')}>Update Numbers Of Fandom</Button>
            <br />           
            {!isAllFandoms && <>
                <Button variant="contained" onClick={() => sendRequestsToServer('handleDuplicateTitles')}>Handle Duplicate Titles</Button>
                <br /></>
            }
        </Grid>

};

export default GridButtons;