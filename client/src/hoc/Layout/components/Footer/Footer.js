import React from 'react';
import './Footer.scss'

import Disclaimer from './components/Desclaimer'
import LastUpdateDate from './components/LastUpdateDate'

const Footer = (props) => (
  <div className={'footer header'}>
    <Disclaimer/>
    <LastUpdateDate lastUpdateDate={props.lastUpdateDate}/>
    <div className='clear'></div>
  </div>
);

export default Footer;