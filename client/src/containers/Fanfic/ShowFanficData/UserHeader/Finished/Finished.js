import React from 'react';
import ReactSVG from 'react-svg'

import classes from '../../ShowFanficData.module.css';

const Finished = (props) => (
    <div onClick={() =>props.props.markStatus(props.fanfic.FanficID,'Finished',props.isInProgress[5])} className={props.isFinished[1]}>
        <ReactSVG src={props.isFinished[3]} className={props.isFinished[2]} wrapper='span' alt='Mark as Finished'  title='Mark as Finished' />
        <span className={classes.IconLabel}>Mark as Finished</span>    
        {/* TODO: if in progress- change text  */}
    </div>
);

export default Finished;