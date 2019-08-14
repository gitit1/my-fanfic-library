import React from 'react';
// import ReactSVG from 'react-svg'
import Button from '@material-ui/core/Button';

//import classes from '../../ShowFanficData.module.css';

const Finished = (props) => (
    <div  className={props.isFinished[0]}>
    <Button  onClick={() =>props.props.markStatus(props.fanfic.FanficID,'Finished',props.isInProgress[5])} className={props.isFinished[1]}
             color='primary' className={props.isFinished[1] ? 'userData_green' : null}>
                {props.isFinished[1] ? 'Finished' : 'Mard As Finished'}
    </Button>                                
 </div>
);

export default Finished;

/*
    <div onClick={() =>props.props.markStatus(props.fanfic.FanficID,'Finished',props.isInProgress[5])} className={props.isFinished[1]}>
        <ReactSVG src={props.isFinished[3]} className={props.isFinished[2]} wrapper='span' alt='Mark as Finished'  title='Mark as Finished' />
        <span className={classes.IconLabel}>Mark as Finished</span>    
        </div>
*/
