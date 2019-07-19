import React,{Component} from 'react';
import {Link} from 'react-router-dom';


import Button from '@material-ui/core/Button';
// import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import classes from './Navigator.module.css';

let anchorEl = null



class Navigator extends Component{
  state = {
    anchorTrack:null,
    anchorManage:null
  }

  setAnchorEl = (el,anchor) =>{
      this.setState({[anchor]:el})
  }
  handleClick = (event,ancorName) =>{
    this.setAnchorEl(event.currentTarget,ancorName);
  }
  
  handleClose = (el,ancorName) =>{
    this.setAnchorEl(el,ancorName);
  }

  render(){

    return(
      <nav className={classes.Navigator}>
        {/* <div className={classes.root}> */}
          {/* <AppBar position="static" className={classes.wrapped}> */}
            {/* <Tabs> */}
                <Button >
                  <Link to="/fandoms">Fandoms</Link>  
                </Button>
                <Button className={classes.NavItem} aria-haspopup="true" >
                  <Link to='/search'>Search</Link>
                </Button>
                <Button className={classes.NavItem} aria-haspopup="true" onClick={(event) => this.handleClick(event,'anchorTrack')}>
                My Tracking
                </Button>
                <Menu
                  getContentAnchorEl={null}
                  elevation={0}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  className={classes.Menu}
                  anchorEl={this.state.anchorTrack}
                  keepMounted
                  open={Boolean(this.state.anchorTrack)}
                  onClose={()=>this.handleClose(null,'anchorTrack')}
                >
                  <MenuItem onClick={()=>this.handleClose(null,'anchorTrack')}><Link to="/dashboard">My Dashboard</Link></MenuItem>
                  <MenuItem onClick={()=>this.handleClose(null,'anchorTrack')}><Link to="/myFandoms">Status Tracker</Link></MenuItem>
                  <MenuItem onClick={()=>this.handleClose(null,'anchorTrack')}><Link to="/readingList">Reading List</Link></MenuItem>
                  <MenuItem onClick={()=>this.handleClose(null,'anchorTrack')}><Link to="/">Favorites</Link></MenuItem>
                  <MenuItem onClick={()=>this.handleClose(null,'anchorTrack')}><Link to="/">Ignored List</Link></MenuItem>
                </Menu>
                <Button className={classes.NavItem} aria-haspopup="true" onClick={(event) => this.handleClick(event,'anchorManage')}>
                  Manage
                </Button>
                <Menu
                  getContentAnchorEl={null}
                  elevation={0}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  className={classes.Menu}
                  anchorEl={this.state.anchorManage}
                  keepMounted
                  open={Boolean(this.state.anchorManage)}
                  onClose={()=>this.handleClose(null,'anchorManage')}
                >
                  <MenuItem onClick={()=>this.handleClose(null,'anchorManage')}><Link to="/manageDownloader">Manage Downloader</Link></MenuItem>
                  <MenuItem onClick={()=>this.handleClose(null,'anchorManage')}><Link to="/manageFandoms">Manage Fandoms</Link></MenuItem>
                </Menu>
                <Button >
                <Link to='/registrer'>Registrer</Link>
                </Button>
                <Button className={classes.NavItem} aria-haspopup="true" >
                  <Link to='/login'>Login</Link>
                </Button>

            {/* </Tabs> */}
          {/* </AppBar> */}
        {/* </div> */}
    </nav>
    )
  }
};

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
