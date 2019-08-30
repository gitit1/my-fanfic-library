
import React,{Component} from 'react';
import {connect} from 'react-redux';

import Container from '../../../components/UI/Container/Container';
import Button from '@material-ui/core/Button';
import GridChooseFandom from '../ManageDownloader/components/GridChooseFnadom/index';
import  AddNewFanficAutomatic from './components/AddNewFanficAutomatic/AddNewFanficAutomatic';
import  AddNewFanficManually from './components/AddNewFanficManually/AddNewFanficManually';

import './AddNewFanfic.scss'
class AddNewFanfic extends Component{
    state = {
        fandomSelect: {
            label: 'Choose Fandom',
            elementType:'select', 
            elementConfig:{options: []},
            value:'',
            visible: true,
            ready: false,
            id:'select-fandom'
        },
        disable:true,
        show:0,
        showDataManually:0,
        switches:{
            save:false
        },
        fandom:null
    }

    componentDidMount(){
        this.createOptionsForFandomSelect(); 
    }

    switchChangeHandler = (type) =>{
        this.setState(prevState =>({switches:{...prevState.switches,save:!this.state.switches[type]}}));  
    }

    inputChangedHandler = (event) =>{
        console.log('inputChangedHandler:')
        const selectedFandom = event.target.value;
        const fandom = this.props.fandoms.filter(fandom => fandom.FandomName===selectedFandom)[0];

        this.setState(prevState =>({
            fandomSelect: {...prevState.fandomSelect,value: selectedFandom},
            disable:false,
            switches:{...prevState.switches,save:fandom.AutoSave},
            fandom:fandom
        })); 
        
    }

    createOptionsForFandomSelect = () =>{
        let options =[];
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

    render(){
        const {show,fandomSelect,disable,switches} = this.state;
        const {fandoms} = this.props;
        return(
            <Container header='Add New Fanfic' className='addNewFanfic'>
                <div className='ChooseFandom'>
                    <GridChooseFandom fandomSelect={fandomSelect} switches={switches} inputChange={this.inputChangedHandler} switchChange={this.switchChangeHandler}/>
                </div>
                
                <React.Fragment>
                    <Button variant="contained" disabled={disable} className='addNewFanficManuallyBTN' onClick={()=>this.setState({show:1})}>Manually</Button>
                    <Button variant="contained" disabled={disable} className='addNewFanficAutomaticBTN' onClick={()=>this.setState({show:2})}>Automatic</Button>
                </React.Fragment> 

                {(show===1) ? 
                <AddNewFanficManually fandomName={fandomSelect.value} fandoms={fandoms}  switches={switches}/>
                : (show===2) &&
                <AddNewFanficAutomatic fandomName={fandomSelect.value} fandoms={fandoms} switches={switches}/>
                
                }
            </Container>
        )
    }

}

const mapStateToProps = state =>{
    return{
        fandoms:        state.fandoms.fandoms
    };   
}
  

export default connect(mapStateToProps,null)(AddNewFanfic);
