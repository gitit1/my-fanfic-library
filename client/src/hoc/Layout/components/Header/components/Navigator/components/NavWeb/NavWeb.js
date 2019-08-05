import React,{Component} from 'react';
import { withRouter } from 'react-router-dom';

import './NavWeb.scss'

import {navLinks} from '../../assets/links_list_for_web';
import NavLink from '../shared/NavigatorBuilder';

class NavWeb extends Component{
    state = {
      anchorTrack:null,
      anchorManage:null,
      active:''
    }
  
    setAnchorEl = (el,anchor) =>{
        this.setState({[anchor]:el})
    }
    clickHandler = (event,ancorName,activeLink) =>{
      this.setAnchorEl(event.currentTarget,ancorName);
      this.activeHandler(activeLink)
    }
    
    closeHandler = (el,ancorName) => {
      this.setAnchorEl(el,ancorName);
    }
    
    activeHandler = (activeLink) => {
        this.setState({active:activeLink})
    }

    render(){

      return (
        <div className='navWeb'>
            {
                navLinks.map(link=>(
                    <NavLink    key={link.label}
                                linkData={link}
                                handleClick={(event) => this.clickHandler(event,link.ancorName,link.label)}
                                handleClose={()=>this.closeHandler(null,link.ancorName,link.label)}
                                handleActivate={()=>this.activeHandler(link.label)}
                                anchorEl={this.state[link.ancorName]} 
                                active={this.state.active}
                                location={this.props.location}
                                auth={this.props.auth}
                    />
                ))
            }
        </div>
        )
    }
  };

  export default withRouter(NavWeb);