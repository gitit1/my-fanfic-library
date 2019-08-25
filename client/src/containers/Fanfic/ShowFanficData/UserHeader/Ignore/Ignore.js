import React from 'react';
//import ReactSVG from 'react-svg';
//import classes from '../../ShowFanficData.module.css';
//import IgnoreSvg from '../../../../../assets/images/icons/ignore.svg'

import Button from '@material-ui/core/Button';

const Ignore = (props) => (
   <div  className={props.isIgnored[0]}>
      <Button  onClick={() =>props.props.markAs(props.fanfic.FanficID,props.fanfic.Author,props.fanfic.FanficTitle,'Ignore',props.isIgnored[1])} 
               color='primary' className={props.isIgnored[2] ? 'userData_red' : null}>
                   {!props.isIgnored[2] ? 'Ignore' : 'Unignore'}
                  
      </Button>                                
   </div>
);

export default Ignore;