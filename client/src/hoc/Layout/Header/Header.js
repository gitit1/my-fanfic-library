import React from 'react';
import classes from './Header.module.css';
import Navigator from './Navigator/Navigator';

const Header = () => (
  <React.Fragment>
      <div className={classes.Left}>My Fanfic Archive</div>
      <div className={classes.Right}>Last Update <span className={classes.TODO}>30.05.19</span></div>
      <div className={classes.Clear}></div>
      <Navigator/>
  </React.Fragment>
);

export default Header;