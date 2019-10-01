import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {contactUs} from '../../../store/actions';
import classnames from 'classnames';

import classes from './ContactUs.module.scss';

import Container from '../../../components/UI/Container/Container';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

class ContactUs extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      message: "",
      errors: {},
      status:0
    };
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
    const msg = {
      name: this.state.name,
      email: this.state.email,
      message: this.state.message,
    };
    this.props.contactUs(msg).then(res=>{
      if(res==='send'){
        this.setState({status:1})
      }else{
        this.setState({status:2})
      }
      
    }); 
  };
render() {
    const { errors } = this.state;
return (
    <Container header='Contact Us'>
        <Card className={classes.ContactUs}>
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
                <br/>
                <div>
                  <textarea 
                        value={this.state.message}
                        placeholder='Message'
                        id='message'
                        onChange={this.onChange}
                        className={classnames("", classes.Message, {
                          invalid: errors.password
                        })}/>
                  <div className="red-text">{errors.message}</div>
                </div>                            
                <br/>   
                { this.state.status===0 
                  ? <Button  type="submit" variant="contained"  className='send_button'>Send</Button>
                  : this.state.status===1
                  ? <p>Message was send!</p>
                  : <React.Fragment>
                      <Button  type="submit" variant="contained"  className='send_button'>Send</Button>
                      <p>There was an Error , Please try again</p>
                    </React.Fragment>

                }                            
                
              </form>
            </Grid>
          </Grid>
        </Card>
    </Container>
    );
  }
}
ContactUs.propTypes = {
  contactUs: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth:   state.auth,
  errors: state.auth
});
  

export default connect(mapStateToProps,{contactUs})(ContactUs);