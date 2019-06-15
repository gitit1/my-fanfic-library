import React,{Component} from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';

import * as actions from '../../store/actions';
import classes from './ManageDownloader.module.css';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Container from '../../components/UI/Container/Container';

const socket = io('ws://localhost:5555', {transports: ['websocket']});


class ManageDownloader extends Component{

  state={
    fandom:{},
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
    timestamp: 'no timestamp yet',
    serverData: null,
    logs: []
  }

  componentWillMount(){
    this.props.onGetFandoms().then(()=>
      this.createOptionsForFandomSelect()
    );
    socket.removeAllListeners()
  }

  createOptionsForFandomSelect = () =>{
    let options =[{value: 'All',displayValue: 'All'}];
    this.props.fandoms.sort((a, b) => a.fandomName.localeCompare(b.fandomName)).map(fandom=>{
          options.push({
            value: fandom.fandomName,
            displayValue: fandom.fandomName
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
    socket.removeAllListeners()
    this.setState({serverData:null,logs:[]})
      console.log('dd; ',this.state.fandom);

      socket.on('getFanficsData', serverData =>{
          this.setState({serverData})
          this.state.logs.push(this.state.serverData)
      })

      // while(this.state.serverData!=='End'){  
      //     this.state.logs.push(this.state.serverData)
      // }
      socket.emit('getFandomFanfics', this.state.fandom);


    // (err, serverData) => (this.setState({serverData}), this.state.logs.push(serverData)) 
  }

  subscribeToTimer = (cb) => {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
  }



  inputChangedHandler = (event) =>{
    socket.removeAllListeners()
    console.log(event.target.value)
    let val = event.target.value;
    let fandom = this.props.fandoms.filter(fandom => fandom.fandomName===val)[0]
    console.log('fandom: ',fandom)
    this.setState(prevState =>({
      fandomSelect: {
            ...prevState.fandomSelect,
              value: val
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

        {/* <Button clicked={() =>this.subscribeToTimer((err, timestamp) => this.setState({ timestamp }))}>subscribeToTimer</Button> */}
        {/* <p className="App-intro">
          This is the timer value: {this.state.timestamp}
        </p> */}
        <p className="App-intro">
        serverData: {this.state.serverData}
        </p>
        {
          this.state.logs.map((log,index)=>(
            <p key={index} dangerouslySetInnerHTML={{ __html:log}}/>

          ))
        }
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