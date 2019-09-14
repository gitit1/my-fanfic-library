import React from 'react';
import ChooseFandom from './chooseFandom'
import Switches from '../../../../../components/UI/Switches/switches'
import { Grid } from '@material-ui/core';

const GridChooseFandom = (props) => (
    <Grid item xs={12}>
        <ChooseFandom fandomSelect={props.fandomSelect} changed={props.inputChange}/>
        {props.showSwitches && <Switches id={props.switches.id} fandomSelect={props.fandomSelect} changed={props.switchChange} switches={props.switches.checked} label='Save Fanfic to Server'/>}
    </Grid>
);

export default GridChooseFandom;