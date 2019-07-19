import React from 'react';
import ReactSVG from 'react-svg';
import classes from '../../ShowFanficData.module.css';
import IgnoreSvg from '../../../../../assets/images/icons/ignore.svg'

const Ignore = (props) => (
    <div onClick={() =>props.props.markAs(props.fanfic.FanficID,'Ignore',props.isIgnored[3])} className={props.isIgnored[0]}>
        <ReactSVG  src={IgnoreSvg} className={props.isIgnored[1]} wrapper='span' alt='Ignore'  title='Ignore' />
        <span className={props.isIgnored[2]}>Ignore Fanfic</span>                                
    </div>
);

export default Ignore;