import React from 'react';
import {Link} from 'react-router-dom';

import classes from './Navigator.module.css';

const Navigator = (props) => (
  <nav className={classes.Navigator}>
    <div className="nav-wrapper">
    <ul>
          {/* Fandoms */}
          <li className={classes.Dropdown}>
            <Link to="/fandoms">Fandoms</Link>          
          </li>
          {/* Search */}
          <li><Link to='/search'>Search</Link></li>
          {/* UserData */}  
          <li className={classes.Dropdown}>
            <Link to='/'>My Tracking</Link>
            <div className={classes.DropdownContent}>
              <Link to="/dashboard">My Dashboard</Link>
              <Link to="/myFandoms">Status Tracker</Link>
              <Link to="/readingList">Reading List</Link>
              <Link to="/">Favorites</Link>
              <Link to="/">Ignored List</Link>
            </div>
          </li>
          {/* Manage */} 
          <li className={classes.Dropdown}>
            <Link to="/" className={classes.Dropbtn}>Manage</Link>
            <div className={classes.DropdownContent}>
                <Link to="/manageDownloader">Manage Downloader</Link>
                <Link to="/manageFandoms">Manage Fandoms</Link>
            </div>          
          </li>
          {/* Auth */}
          <li><Link to='/registrer'>Registrer</Link></li>
          <li><Link to='/login'>Login</Link></li>
          {/* TODO: DELETE WHEN DONE */}  
          <li><Link to="/todolistClient">TODO LIST CLIENT</Link></li>
          <li><Link to="/todolistServer">TODO LIST SERVER</Link></li>
         
      </ul>
    </div>
  </nav>
);

export default Navigator;

//TODO:
/*
1. header - needs fix
2. time - need to get from json
3. nav - need fix
4. link - router
5. links - expand
6. add active page
*/