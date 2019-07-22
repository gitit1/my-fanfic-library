import React,{Component} from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';

import * as actions from '../../../store/actions';
import classes from './ManageDownloader.module.css';

import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Container from '../../../components/UI/Container/Container';

//const socket = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') 
//               ? io('ws://localhost:5005', {transports: ['websocket']}) 
//               : io('ws://192.236.176.82:5005', {transports: ['websocket']}) ;

const socket = io('ws://localhost:5005', {transports: ['websocket']})

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
    typeSelect: {
      label: 'Choose Type for saving fanfics',
      elementType:'select', 
      elementConfig:{
        options: [{value: 'azw3' ,displayValue:  'azw3' ,checked: false},
        {value: 'epub' ,displayValue: 'epub'  ,checked: false},
        {value: 'mobi' ,displayValue: 'mobi'  ,checked: false},
        {value: 'pdf'  ,displayValue:  'pdf'  ,checked: false},
        {value: 'html' ,displayValue: 'html'  ,checked: false}]
      },
      value:'epub',
      visible: true,
      ready: true
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
              ready:true
      }
    }));  

  }

  sendRequestsToServerHandler = async (choice) =>{
    socket.removeAllListeners()
    this.setState({serverData:null,logs:[]})

    socket.on('getFanficsData', serverData =>{
        this.setState({serverData})
        this.state.logs.push(this.state.serverData)
        if(this.state.serverData==='End'){
          this.state.logs.push('Done!')
          this.props.onGetFandoms()
        }
    })
    switch (choice) {
      case 'saveFanfics':
          let method = this.state.typeSelect.value
          socket.emit('getFandomFanfics', this.state.fandom,choice,method);
        break;
    
      default:
        socket.emit('getFandomFanfics', this.state.fandom,choice);
        break;
    }
      
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

  typeInputChangedHandler = (event) =>{
    socket.removeAllListeners()

    let selectedMethod = event.target.value;
    
    this.setState(prevState =>({
      typeSelect: {
            ...prevState.typeSelect,
              value: selectedMethod
      }
    }));  
  }

  render(){
    const {fandom,fandomSelect,typeSelect} = this.state;
    let page = this.state.fandomSelect.ready 
    ? (
      <Container header={'ManageDownloader'}>
        <div className={classes.Fandom}>
            <Input
                label={fandomSelect.label}
                elementType={fandomSelect.elementType} 
                elementConfig={fandomSelect.elementConfig} 
                value={fandomSelect.value} 
                invalid={!fandomSelect.valid}
                shouldValidate={fandomSelect.validation}
                touched={fandomSelect.touched}
                visible={fandomSelect.visible}
                changed={(event) => this.inputChangedHandler(event)}
              />
            <br/>    
        </div>
        {fandom.AutoSave && <p>This is an auto save fanfics fandom , when click on "Get/Update Fandom Fanfics" the fanfics will be saved automaticlly</p>}
        <div className={classes.Buttons}>
          <Button clicked={()=>this.sendRequestsToServerHandler('getFandomFanfics')}>Get/Update Fandom Fanfics</Button>
          <Button clicked={()=>this.sendRequestsToServerHandler('getDeletedFanfics')}>Get/Update Deleted Fanfics of this Fandom</Button>  
          {!(fandom.AutoSave||fandom=='All')  && (
            <div className={classes.Fandom}>
              <Input
                label={typeSelect.label}
                elementType={typeSelect.elementType} 
                elementConfig={typeSelect.elementConfig} 
                value={typeSelect.value} 
                touched={typeSelect.touched}
                visible={typeSelect.visible}
                changed={(event) => this.typeInputChangedHandler(event)}
              />
              <Button clicked={()=>this.sendRequestsToServerHandler('saveFanfics')} >Save Fanfics of this Fandom</Button>
              </div>
          )}  
        </div>
        <br/>
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
      onGetFandoms:              ()                                  =>      dispatch(actions.getFandomsFromDB())
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(ManageDownloader);;