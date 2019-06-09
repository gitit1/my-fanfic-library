import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';
import classes from './ManageDownloader.module.css';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Container from '../../components/UI/Container/Container';


class ManageDownloader extends Component{

  state={
    fandom:null,
    fandomSelect: {
        label: 'Choose Fandom',
        elementType:'select', 
        elementConfig:{
            options: []
        },
        value:'All',
        validation:{},
        valid: true,
        visible: true,
        ready: false
    }
  }

  componentWillMount(){
    this.props.onGetFandoms().then(()=>
      this.createOptionsForFandomSelect()
    );
  }

  createOptionsForFandomSelect = () =>{
    let options =[{value: 'All',displayValue: 'All'}];
    this.props.fandoms.sort((a, b) => a.Fandom_Name.localeCompare(b.Fandom_Name)).map(fandom=>{
          options.push({
            value: fandom.Fandom_Name,
            displayValue: fandom.Fandom_Name
          }
        )
        return null
    });
    this.setState(prevState =>({
      fandomSelect: {
            ...prevState.fandomSelect,
              'elementConfig':{
                  ...prevState.fandomSelect.elementConfig.options,
                  options:options
              },
              formIsValid:true,
              ready:true
      }
    }));  

  }

  getFandomFanfics = () =>{
    console.log('test')
  }

  inputChangedHandler = (event) =>{
    console.log(event.target.value)
    let val = event.target.value;

    this.setState(prevState =>({
      fandomSelect: {
            ...prevState.fandomSelect,
              value: val
      }
    }));  
  }

  render(){
    let page = this.state.fandomSelect.ready 
    ? (
      <Container header={'ManageDownloader'}>
        <div className={classes.Fandom}>
            <Input
                label={this.state.fandomSelect.label}
                elementType={this.state.fandomSelect.elementType} 
                elementConfig={this.state.fandomSelect.elementConfig} 
                value={this.state.fandomSelect.value} 
                invalid={!this.state.fandomSelect.valid}
                shouldValidate={this.state.fandomSelect.validation}
                touched={this.state.fandomSelect.touched}
                visible={this.state.fandomSelect.visible}
                changed={(event) => this.inputChangedHandler(event)}
              />
            <br/>    
        </div>
        <Button clicked={this.getFandomFanfics}>Get/Update Fandom Fanfics</Button>
      </Container>
      )
    : <Container><Spinner/></Container> 

    return(
      page
    )

  }
};

const mapStateToProps = state =>{
  return{
      fandoms:        state.fandoms.fandoms,
      fandom:         state.fandoms.fandom,
      message:        state.fandoms.message,
      loading:        state.fandoms.loading
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      // initFandom:     () => dispatch(actions.fandomInit()),
      onGetFandoms:       ()                                  =>      dispatch(actions.getFandomsFromDB()),
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(ManageDownloader);;