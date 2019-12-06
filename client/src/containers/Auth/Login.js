import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {loginUser} from '../../store/actions';

import classes from './Login.module.scss';
import classnames from 'classnames';
import Container from '../../components/UI/Container/Container';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }
  
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

componentWillReceiveProps(nextProps) {
  if (nextProps.auth.isAuthenticated) {
    this.props.history.push("/dashboard"); // push user to dashboard when they login
  }
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
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
  console.log(userData);
  this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
};

render() {
    const { errors } = this.state;
return (
    <Container header='Login'>
      <div className={classes.ClosedToinvitation}>
        <h3>The site is currently open with invitation only.</h3>
        <h5>Want to join the pilot? <Link to="/contact">Contact Us</Link></h5>
      </div>
      <Card className={classes.Login}>
        <Grid container className={classes.ContainerGrid}>
          <Grid item xs={8} className={classes.FormGrid}>
            <form noValidate onSubmit={this.onSubmit}>
              <TextField 
                className={classnames("", classes.Email , {
                  invalid: errors.email || errors.emailnotfound
                })}
                error={errors.email}
                label='Email'
                id="email"
                type="email"
                margin="dense"
                value={this.state.email}
                onChange={this.onChange}/>
              <span className="red-text">
                {errors.email}
                {errors.emailnotfound}
              </span>
              <br/>
              <TextField 
                className={classnames("", classes.Password, {
                  invalid: errors.password || errors.passwordincorrect
                })}
                error={errors.password}
                label='Password'
                id="password"
                type="password"
                margin="dense"
                value={this.state.password}
                onChange={this.onChange}/>

              <span className="red-text">
                {errors.password}
                {errors.passwordincorrect}
              </span>
              <br/>                               
              <br/>                               
              <Button  type="submit" variant="contained"  className='send_button'>Login</Button>
            </form>
            <br/> 
            {/* <div className={classes.Registrer}>Don't have an account? <Link to="/register">Register</Link></div> */}
          </Grid>
        </Grid>
      </Card>
    </Container>
    );
  }
}
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.auth
});

export default connect(mapStateToProps,{loginUser})(Login);