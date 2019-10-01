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
                    <b className='color_AO3'>AO3:&nbsp;</b> 
                    <b>{props.fanficsNumbers.ao3FanficsCount.toLocaleString(undefined, {maximumFractionDigits:2})}</b>
                </React.Fragment>
            }
            {props.fanficsNumbers.ffFanficsCount>0 &&
                <React.Fragment>
                    &nbsp;,&nbsp;
                    <b className='color_FF'>FF:&nbsp;</b>
                    <b>{props.fanficsNumbers.ffFanficsCount}</b>
                </React.Fragment>
            }
            {props.fanficsNumbers.fanficsDeletedCount>0 &&
                <React.Fragment>
                    &nbsp;,&nbsp;
                    <b className='color_Backup'>Backup (Deleted from sites):&nbsp;</b>
                    <b>{props.fanficsNumbers.fanficsDeletedCount}</b>
                </React.Fragment>
            }
            {props.fanficsNumbers.tumblrFanficsCount>0 &&
                <React.Fragment>
                    &nbsp;,&nbsp;
                    <b className='color_Tumblr'>Tumblr:&nbsp;</b>
                    <b>{props.fanficsNumbers.tumblrFanficsCount}</b>
                </React.Fragment>
            }
            {props.fanficsNumbers.wattpadFanficsCount>0 &&
                <React.Fragment>
                    &nbsp;,&nbsp;
                    <b className='color_Wattpad'>Wattpad:&nbsp;</b>
                    <b>{props.fanficsNumbers.wattpadFanficsCount}</b>
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