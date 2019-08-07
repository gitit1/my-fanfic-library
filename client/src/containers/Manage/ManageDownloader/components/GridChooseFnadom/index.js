import React from 'react';
import ChooseFandom from './chooseFandom'
import Switches from './switches'
import { Grid } from '@material-ui/core';

const GridChooseFandom = (props) => (
    <Grid item xs={12}>
        <ChooseFandom fandomSelect={props.fandomSelect} changed={props.inputChange}/>
        <Switches fandomSelect={props.fandomSelect} changed={props.switchChange} switches={props.switches}/>
    </Grid>
);

export default GridChooseFandom;