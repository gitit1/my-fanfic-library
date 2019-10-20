import React from 'react';
import { Grid,Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const FanficsNumbers = (props) => {
    const {fanficsNumbers} = props;
    return(
        <Grid  className='fanficNumbers' item xs={9}>
            <Grid container alignItems="center">
                <span className='total'>Total:&nbsp;</span>{fanficsNumbers.fanficsTotalCount.toLocaleString(undefined, {maximumFractionDigits:2})}
                <span className="fanficNumbersDevider"></span>
                <span className='total'>Sources:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                {fanficsNumbers.ao3FanficsCount>0 &&
                    <React.Fragment>
                        <span className='color_AO3'>AO3:&nbsp;</span>{fanficsNumbers.ao3FanficsCount.toLocaleString(undefined, {maximumFractionDigits:2})}
                    </React.Fragment>
                }
                {fanficsNumbers.fanficsDeletedCount>0 &&
                    <React.Fragment>
                        <span className="fanficNumbersDevider small"></span>
                        <span className='color_Backup'>Backup (Deleted from sites):&nbsp;</span>{fanficsNumbers.fanficsDeletedCount.toLocaleString(undefined, {maximumFractionDigits:2})}
                    </React.Fragment>
                }
                {fanficsNumbers.ffFanficsCount>0 &&
                    <React.Fragment>
                        <span className="fanficNumbersDevider small"></span>
                        <span className='color_FF'>FF:&nbsp;</span>{fanficsNumbers.ffFanficsCount.toLocaleString(undefined, {maximumFractionDigits:2})}
                    </React.Fragment>
                }
                {fanficsNumbers.tumblrFanficsCount>0 &&
                    <React.Fragment>
                        <span className="fanficNumbersDevider small"></span>
                        <span className='color_Tumblr'>Tumblr:&nbsp;</span>{fanficsNumbers.tumblrFanficsCount.toLocaleString(undefined, {maximumFractionDigits:2})}
                    </React.Fragment>
                }
                {fanficsNumbers.wattpadFanficsCount>0 &&
                    <React.Fragment>
                        <span className="fanficNumbersDevider small"></span>
                        <span className='color_Wattpad'>Wattpad:&nbsp;</span>{fanficsNumbers.wattpadFanficsCount.toLocaleString(undefined, {maximumFractionDigits:2})}
                    </React.Fragment>
                }
                {props.fanficsNumbers.fanficsIgnoredCount>0 &&
                    <React.Fragment>
                        <span className="fanficNumbersDevider"></span>
                        <span className='total'>Ignored:&nbsp;</span>{props.fanficsNumbers.fanficsIgnoredCount.toLocaleString(undefined, {maximumFractionDigits:2})}
                        &nbsp;(filter by ignore to see them and reactive them)
                    </React.Fragment>
                }

            </Grid>
        </Grid>
    )
}
        {/* 

        </p>
        {props.fanficsNumbers.fanficsIgnoredCount>0 &&
            <p><b>{props.fanficsNumbers.fanficsIgnoredCount.toLocaleString(undefined, {maximumFractionDigits:2})}&nbsp;</b>  
            of the fanfics are ignored (filter by ignore to see them and reactive them)</p> 
        } */}

export default FanficsNumbers;