import React from 'react';
import {Link} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const NavLink = (props) => {
    let navLinks =null;
    let active = (props.mode!=='mobile' &&
                  props.active===props.linkData.label &&
                  props.location.pathname!=='/') ? 'active' : '';
    
    let isManager = props.linkData.auth_manager;
    let isLogin = props.linkData.auth;
    const create = (isManager && props.auth.isManager) ? true : (isLogin && props.auth.isAuthenticated) ? true : (!isLogin && !isManager) ? true : false


    if (create)
        switch (props.linkData.type) {
            case 'button':
                navLinks = (
                    <Button className={active} onClick={props.handleActivate}>
                        <Link to={props.linkData.link}>{props.linkData.label}</Link>  
                    </Button>
                )
                break;
            case 'mobile':
                navLinks = (
                    <React.Fragment>
                        {props.linkData.list.length > 1 && <h3>{props.linkData.label}</h3>}
                        <List>
                            {props.linkData.list.map((item, index) => (
                                <Link to={item.link}  key={item.label}>
                                    <ListItem button>
                                        <ListItemText primary={item.label}  onClick={props.handleActivate}/>
                                    </ListItem>
                                </Link> 
                            ))}
                            <Divider />
                        </List>
                    </React.Fragment>
                )
                break;                  
            case 'menu':
                navLinks = (
                    <React.Fragment>
                        <Button className={active} aria-haspopup="true" onClick={props.handleClick}>
                            {props.linkData.label}
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
                            anchorEl={props.anchorEl}
                            keepMounted
                            open={Boolean(props.anchorEl)}
                            onClose={props.handleClose}
                            className='menu'
                        >
                            {props.linkData.subLinks.map(subLink=>(
                                <MenuItem   key={subLink.label}
                                            onClick={props.handleClose} 
                                            >
                                    <Link to={subLink.link}>{subLink.label}</Link>
                                </MenuItem>
    
                            ))}
                        </Menu> 
                    </React.Fragment>
                )
                break;
            default:
                break;
        }
   
    
    return(
        navLinks
    )
};

export default NavLink;