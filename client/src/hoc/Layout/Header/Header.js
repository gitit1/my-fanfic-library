import React from 'react';
import {Link} from 'react-router-dom';

import Navigator from './Navigator/Navigator';
import './Header.scss'

const Header = (props) => (
  <React.Fragment>
    <div className={'header_section_left header'}><Link to='/'>My Fanfic Archive</Link></div>
    <div className={'header_section_right responsive_hide'}>
      <p className='header'>Last Update:&nbsp; 
        <span>
          {new Date(props.lastUpdateDate).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}       
        </span>
      </p>
    </div>
    <div className={'clear'}></div>
    <Navigator/>
  </React.Fragment>
);

export default Header;