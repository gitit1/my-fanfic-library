import React,{Component} from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';

import * as actions from '../../../store/actions';
import classes from './ManageDownloader.module.css';

import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Container from '../../../components/UI/Container/Container';

const socket = io('ws://localhost:5555', {transports: ['websocket']});


class ManageDownloader extends Component{

  state={
    fandom:'All',
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
    },
    serverData: null,
    logs: []
  }

  componentDidMount(){
    this.createOptionsForFandomSelect()
    socket.removeAllListeners()
  }

  componentWillUnmount(){
    this.props.onGetFandoms()
  }

  createOptionsForFandomSelect = () =>{
    let options =[{value: 'All',displayValue: 'All'}];
    this.props.fandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName)).map(fandom=>{
          options.push({
            value: fandom.FandomName,
            displayValue: fandom.FandomName
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

  getFandomFanfics = async () =>{
    socket.removeAllListeners()
    this.setState({serverData:null,logs:[]})

      socket.on('getFanficsData', serverData =>{
          this.setState({serverData})
          this.state.logs.push(this.state.serverData)
          if(this.state.serverData==='End'){
            // this.props.onGetFandoms()
            this.state.logs.push('Done!')
          }
      })

      socket.emit('getFandomFanfics', this.state.fandom);
      
  }



  inputChangedHandler = (event) =>{
    socket.removeAllListeners()

    let selectedFandom = event.target.value;
    let fandom = (selectedFandom==='All') ? 'All' : (this.props.fandoms.filter(fandom => fandom.FandomName===selectedFandom)[0])
    
    this.setState(prevState =>({
      fandomSelect: {
            ...prevState.fandomSelect,
              value: selectedFandom
      },
      fandom:fandom,
      serverData: null,
      logs: []
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
        <div className={classes.MsgBoard}>
          {/* <p>serverData: {this.state.serverData}</p> */}
        {
          this.state.logs.map((log,index)=>(
            <p key={index} dangerouslySetInnerHTML={{ __html:log}}/>

          ))
        }
        </div>
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
      fandoms:        state.fandoms.fandoms
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      // initFandom:     () => dispatch(actions.fandomInit()),
      onGetFandoms:       ()                                  =>      dispatch(actions.getFandomsFromDB()),
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(ManageDownloader);;