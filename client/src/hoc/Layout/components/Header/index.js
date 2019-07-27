import React from 'react';
import {Link} from 'react-router-dom';

import Navigator from './components/Navigator';
import Login from './components/Login';
import './style/Header.scss'

const Header = (props) => (
  <div className='header'>
    <div className='logo header responsive_hide'><Link to='/'>My Fanfic Archive</Link></div>
    <div className='navigator'><Navigator auth={props.auth}/></div>
    <div className='login'><Login auth={props.auth} logout={props.logout}/></div>
    <div className='clear'></div>
  </div>
);

export default Header;