import React from 'react';
import classes from './Navigator.module.css';

const Navigator = () => (
  <nav className={classes.Navigator}>
      <ul>
          <li className={classes.Dropdown}>
            <a href="/" className={classes.Dropbtn}>Fandoms</a>
            <div className={classes.DropdownContent}>
                <a href="/allFandoms">All Fandoms</a>
                <a href="/manageFandoms">Manage Fandoms</a>
            </div>          
          </li>
          <li><a href='/'>Search</a></li>
          <li className={classes.Dropdown}>
              <a href='/'>My Tracking</a>
              <div className={classes.DropdownContent}>
                <a href="/">Favorits</a>
                <a href="/">Status Tracker</a>
                <a href="/">Reading List</a>
              </div>
          </li>
          <li><a href='/manageDownloader'>Manage Downloader</a></li>
          <li><a href="/todolistClient">TODO LIST CLIENT</a></li>
          <li><a href="/todolistServer">TODO LIST SERVER</a></li>
         
      </ul>
  </nav>
);

export default Navigator;

/*
1. header - needs fix
2. time - need to get from json
3. nav - need fix
4. link - router
5. links - expand
*/