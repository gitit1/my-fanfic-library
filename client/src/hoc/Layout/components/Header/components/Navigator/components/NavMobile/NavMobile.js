import React,{Component} from 'react';
import { Link } from "react-router-dom";

import './NavMobile.scss'

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import NavLink from '../shared/NavigatorBuilder';
import {navLinks} from '../../assets/links_list_for_mobile';

class NavMobile extends Component{

  state = {
    drawer: false
  }

  toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({drawer: open});
}

  render(){

    return(
      <div className='navMobile'>
        <IconButton edge="start" color="inherit" aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={this.toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={this.state.drawer} onClose={this.toggleDrawer(false)}>
            <div role="presentation" className='drawer'>
              <IconButton edge="start" color="inherit" aria-label="more" aria-controls="long-menu" aria-haspopup="true"  onClick={this.toggleDrawer(false)}>
                <ChevronLeftIcon/>
              </IconButton>
              <Divider />
                {
                navLinks.map(link=>(
                    <NavLink    key={link.label}
                                linkData={link}
                                anchorEl={this.state[link.ancorName]} 
                                active={this.state.active}
                                handleActivate={this.toggleDrawer(false)}
                                mode='mobile'
                                auth={this.props.auth}
                    />
                ))
              }  
            </div>
        </Drawer>
   
        <Link to="/" className="btn-flat waves-effect"><p className='title'>My Fanfic Library</p></Link>
        <div className='clear'></div>
      </div>
    )
  }
}

export default NavMobile;