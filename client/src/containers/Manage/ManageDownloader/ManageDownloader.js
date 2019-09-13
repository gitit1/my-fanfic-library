import React,{Component} from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';

import * as actions from '../../../store/actions';

import Container from '../../../components/UI/Container/Container';

import { Grid } from '@material-ui/core';

import GridChooseFandom from './components/GridChooseFnadom'
import GridButtons from './components/GridButtons'
import GridDataBox from './components/GridDataBox';
import Button from '@material-ui/core/Button';

import './ManageDownloader.scss';

const socket = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') 
? io('ws://localhost:8080', {transports: ['websocket']}, {secure:false}) 
: (window.location.origin.includes('mfl-s'))
? io(window.location.origin.replace(/^http/, 'ws') + ':8081', {transports: ['websocket']}, {secure:false}) 
: io(window.location.origin.replace(/^http/, 'ws') + ':8080', {transports: ['websocket']}, {secure:false}) ;


  

class ManageDownloader extends Component{

    state={
        fandom:'All',
        fandomSelect: {
            label: 'Choose Fandom',
            elementType:'select', 
            elementConfig:{options: []},
            value:'',
            visible: true,
            ready: false,
            id:'select-fandom'
        },
        typeSelect: {
          label: 'Choose Type for saving fanfics',
          elementType:'select', 
          elementConfig:{
            options: [
                {value: 'azw3' ,displayValue:  'azw3' ,checked: false},
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
        logs: [],
        switches:{
            save:false
        },
        showData:0,
        showGridDataBox:false,
        showGridButtons:true
    }

    componentDidMount(){
        console.log('(window.location.origin.includes(mfl-s)):',(window.location.origin))
        this.createOptionsForFandomSelect(); 
        socket.removeAllListeners();
        !this.props.smallSize && this.setState({showGridDataBox:true})
    }

    componentWillUnmount(){this.props.onGetFandoms()}

    createOptionsForFandomSelect = () =>{
        let options =[{value: 'All',displayValue: 'All'}];
        this.props.fandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName)).map(fandom=>{
            options.push({value: fandom.FandomName,displayValue: fandom.FandomName})
            return null
        });
        this.setState(prevState =>({
          fandomSelect: {...prevState.fandomSelect,
                            'elementConfig':{ ...prevState.fandomSelect.elementConfig.options,options:options},
                            ready:true
          }
        }));  
    
    }

    sendRequestsToServerHandler = async (choice) =>{
        // const {serverData} = this.state;
        const {smallSize} = this.props;
        socket.removeAllListeners()
        this.setState({serverData:null,logs:[],showData:0})
        smallSize && this.setState({showGridDataBox: true,showGridButtons: false});

        socket.on('getFanficsData', serverData =>{
            this.setState({serverData})
            this.state.logs.push(this.state.serverData)
            if(this.state.serverData==='End'){
                this.state.logs.push('Done!');
                this.props.onGetFandoms();
            }
        });

        
        switch (choice) {
            case 'saveFanfics':
                let method = this.state.typeSelect.value;
                socket.emit('getFandomFanfics', this.state.fandom,choice,method);
                break;
        
            default:
                socket.emit('getFandomFanfics', this.state.fandom,choice);
                break;
        }
            
    }

    inputChangedHandler = (event) =>{
        socket.removeAllListeners()

        const selectedFandom = event.target.value,logs=[],serverData=null;
        let fandom = (selectedFandom==='All') ? 'All' : (this.props.fandoms.filter(fandom => fandom.FandomName===selectedFandom)[0]);
        let showData = (selectedFandom==='All') ? 0 : 1;

        this.props.smallSizeMode && this.setState({showGridDataBox: false,showGridButtons: true});
        this.setState(prevState =>({
            fandom,serverData,logs,showData,
            fandomSelect: {...prevState.fandomSelect,value: selectedFandom},
            switches:{...prevState.switches,save:fandom.AutoSave}
        }));  
    }

    typeInputChangedHandler = (event) =>{
        socket.removeAllListeners()

        let selectedMethod = event.target.value;
        
        this.setState(prevState =>({typeSelect: {...prevState.typeSelect,value: selectedMethod}}));  
    }
    
    switchChangeHandler = (type) =>{
        this.setState(prevState =>({switches:{...prevState.switches,save:!this.state.switches[type]}}));  
    }

    addNewFanficHandler = () =>{
        this.setState({showData:2})
        this.props.smallSize && this.setState({showGridDataBox: true,showGridButtons: false})
    }
    toggleBottons= () =>{
        this.props.smallSize && this.setState({showGridDataBox: false,showGridButtons: true});
    }

    render(){
        const {fandom,fandomSelect,switches,logs,showData,showGridButtons,showGridDataBox} = this.state
        const {smallSize} = this.props
        return(
            <Container header='Downloader' className='managedownloader'>
                <Grid container className='downloader' spacing={2}>
                    <GridChooseFandom fandomSelect={fandomSelect} switches={switches} inputChange={this.inputChangedHandler} switchChange={this.switchChangeHandler}/>
                    {this.props.smallSize && showGridDataBox &&  <Button variant="contained" className='backButton' onClick={()=>this.toggleBottons()}>Back to Bottons</Button>}
                    {
                     fandomSelect.value!=='' &&
                        <React.Fragment> 
                            <GridButtons sendRequestsToServer={this.sendRequestsToServerHandler} addNewFanfic={this.addNewFanficHandler} showBox={showGridButtons}/>
                            <GridDataBox fandom={fandom} showData={showData} logs={logs} switches={switches} showBox={showGridDataBox} smallSizeMode={smallSize}/>
                        </React.Fragment>
                    }
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = state =>{
    return{
        fandoms:        state.fandoms.fandoms,
        size:           state.screenSize.size,
        smallSize:      state.screenSize.smallSize
    };   
  }
  
  const mapDispatchedToProps = dispatch =>{
    return{
        // initFandom:     () => dispatch(actions.fandomInit()),
        onGetFandoms:              ()                                  =>      dispatch(actions.getFandomsFromDB())
    };
  }
  
  export default connect(mapStateToProps,mapDispatchedToProps)(ManageDownloader);