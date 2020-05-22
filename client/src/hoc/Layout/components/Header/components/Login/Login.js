import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import './Login.scss'

const Login = (props) => (
    <div className="Login">
        {
            props.auth.isAuthenticated
                ? <Button onClick={props.logout}>Log Out</Button>
                : <Button><Link to='/login'>Login</Link></Button>
        }
    </div>
);

export default Login;