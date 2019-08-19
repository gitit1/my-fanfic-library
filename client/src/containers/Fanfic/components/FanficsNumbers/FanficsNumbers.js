import React from 'react';
import { Grid } from '@material-ui/core';

const FanficsNumbers = (props) => (
    <Grid  className={'fanficNumbers'} item xs={9}>
        <p>There is a total of 
            <b>&nbsp;{props.fanficsNumbers.fanficsTotalCount.toLocaleString(undefined, {maximumFractionDigits:2})}&nbsp;</b>fanfics in 
            <b>&nbsp;{props.fandomName}&nbsp;</b>Fandom
        </p>
        <p>Sources:&nbsp;&nbsp; 
            {props.fanficsNumbers.ao3FanficsCount>0 &&
                <React.Fragment>
                    <b style={{color:'#8A0407'}}>AO3:&nbsp;</b> 
                    <b>{props.fanficsNumbers.ao3FanficsCount.toLocaleString(undefined, {maximumFractionDigits:2})}</b>
                </React.Fragment>
            }
            {props.fanficsNumbers.ffFanficsCount>0 &&
                <React.Fragment>
                    &nbsp;,&nbsp;
                    <b style={{color:'#333398'}}>FF:&nbsp;</b>
                    <b>{props.fanficsNumbers.ffFanficsCount}</b>
                </React.Fragment>
            }
            {props.fanficsNumbers.fanficsDeletedCount>0 &&
                <React.Fragment>
                    &nbsp;,&nbsp;
                    <b style={{color:'#968c8c'}}>Backup (Deleted from sites):&nbsp;</b>
                    <b>{props.fanficsNumbers.fanficsDeletedCount}</b>
                </React.Fragment>
            }
        </p>
        {props.fanficsNumbers.fanficsIgnoredCount>0 &&
            <p><b>{props.fanficsNumbers.fanficsIgnoredCount.toLocaleString(undefined, {maximumFractionDigits:2})}&nbsp;</b>  
            of the fanfics are ignored (filter by ignore to see them and reactive them)</p> 
        }
    </Grid>
);

export default FanficsNumbers;