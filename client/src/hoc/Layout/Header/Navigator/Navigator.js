import React from 'react';
import classes from './Navigator.module.css';
import {Link} from 'react-router-dom';

const Navigator = () => (
  <nav className={classes.Navigator}>
      <ul>
          <li className={classes.Dropdown}>
            <Link to="/" className={classes.Dropbtn}>Fandoms</Link>
            <div className={classes.DropdownContent}>
                <Link to="/allFandoms">All Fandoms</Link>
                <Link to="/manageFandoms">Manage Fandoms</Link>
            </div>          
          </li>
          <li><Link to='/'>Search</Link></li>
          <li className={classes.Dropdown}>
              <Link to='/'>My Tracking</Link>
              <div className={classes.DropdownContent}>
                <Link to="/">Favorits</Link>
                <Link to="/">Status Tracker</Link>
                <Link to="/">Reading List</Link>
              </div>
          </li>
          <li><Link to='/manageDownloader'>Manage Downloader</Link></li>
          <li><Link to='/registrer'>Registrer</Link></li>
          <li><Link to='/login'>Login</Link></li>
          <li><Link to="/todolistClient">TODO LIST CLIENT</Link></li>
          <li><Link to="/todolistServer">TODO LIST SERVER</Link></li>
         
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