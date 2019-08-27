
import React,{Component} from 'react';
import {connect} from 'react-redux';

import Container from '../../../components/UI/Container/Container';
import Button from '@material-ui/core/Button';
import ChooseFandom from '../ManageDownloader/components/GridChooseFnadom/chooseFandom';
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
        show:0
    }

    componentDidMount(){
        this.createOptionsForFandomSelect(); 
    }

    inputChangedHandler = (event) =>{

        const selectedFandom = event.target.value,logs=[],serverData=null;
        let fandom = (selectedFandom==='All') ? 'All' : (this.props.fandoms.filter(fandom => fandom.FandomName===selectedFandom)[0]);

        this.setState(prevState =>({
            fandomSelect: {...prevState.fandomSelect,value: selectedFandom}
        }));  
    }

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

    render(){
        const {show,fandomSelect} = this.state;

        return(
            <Container header='Add New Fanfic' className='addNewFanfic'>
                <div className='ChooseFandom'><ChooseFandom fandomSelect={fandomSelect} changed={this.inputChangedHandler}/></div>
                
                <React.Fragment>
                    <Button variant="contained" className='addNewFanficManuallyBTN' onClick={()=>this.setState({show:1})}>Manually</Button>
                    <Button variant="contained" className='addNewFanficAutomaticBTN' onClick={()=>this.setState({show:2})}>Automatic</Button>
                </React.Fragment> 

                {(show===1) ? 
                <AddNewFanficManually />
                : (show===2) &&
                <AddNewFanficAutomatic />
                
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
