import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {registerUser} from '../../store/actions';

import classnames from 'classnames';

import classes from './Register.module.scss';

import Container from '../../components/UI/Container/Container';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history); 
    console.log(newUser);
  };
render() {
    const { errors } = this.state;
return (
    <Container header='Register'>
        <Card className={classes.Register}>
          <Grid container className={classes.ContainerGrid}>
            <Grid item xs={8} className={classes.FormGrid}>
              <form noValidate onSubmit={this.onSubmit}>
                <div>
                  <TextField
                        onChange={this.onChange}
                        value={this.state.name}
                        error={errors.name}
                        label='Name'
                        margin="dense"
                        id="name"
                        type="text"
                        className={classnames("", classes.Name, {
                          invalid: errors.name
                        })}
                  />
                  <div className="red-text">{errors.name}</div>
                </div>
                <div>
                  <TextField
                        onChange={this.onChange}
                        value={this.state.email}
                        error={errors.email}
                        label='Email'
                        margin="dense"
                        id="email"
                        type="email"
                        className={classnames("", classes.Email, {
                          invalid: errors.email
                        })}
                  />
                  <div className="red-text">{errors.email}</div>
                </div>
                <div>
                  <TextField
                        onChange={this.onChange}
                        value={this.state.password}
                        error={errors.password}
                        label='Password'
                        margin="dense"
                        id="password"
                        type="password"
                        className={classnames("", classes.Password, {
                          invalid: errors.password
                        })}
                  />
                  <div className="red-text">{errors.password}</div>
                </div>
                <div>
                  <TextField
                        onChange={this.onChange}
                        value={this.state.password2}
                        error={errors.password2}
                        label='Confirm Password'
                        margin="dense"
                        id="password2"
                        type="password"
                        className={classnames("", classes.Password2, {
                          invalid: errors.password
                        })}
                  />
                  <div className="red-text">{errors.password2}</div>
                </div>                             
                <br/>                               
                <Button  type="submit" variant="contained"  className='send_button'>Login</Button>
              </form>
              <br/> 
              <div className={classes.Login}>Already have an account? <Link to="/login">Log in</Link></div>
            </Grid>
          </Grid>
        </Card>
    </Container>
    );
  }
}
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth:   state.auth,
  errors: state.auth
});
  

export default connect(mapStateToProps,{registerUser})(Register);