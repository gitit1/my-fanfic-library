import React,{Component} from 'react';

import {fanficDataForm} from './assets/FanficDataForm';
import BuildForm from '../../../ManageFandoms/components/AddNewFandom/components/BuildForm'

import './AddNewFanficManually.scss';

class AddNewFanficManually extends Component{
    
    state ={
        fanficForm:fanficDataForm[0],
        formIsValid:false,
        fandomAddedFlag:0,
        editMode:false
    }
    sendFandomToServerHandler = () => {
        return
    }

    inputCheckedHandler = () => {
        return
    }

    inputChangedHandler = () => {
        return
    }
    render(){
        const {fanficForm,formIsValid} = this.state;
        
        const formElementsArray = [];
        for(let key in fanficForm){
            formElementsArray.push({
                id:key,
                config: fanficForm[key]
            })
        }
        return(
            <div className='AddNewFanficManually'>
                <BuildForm onSubmit={this.sendFandomToServerHandler} array={formElementsArray} check={this.inputCheckedHandler} 
                           changed={this.inputChangedHandler} disabled={!formIsValid} buttonSendLabel='UPLOAD'/>
            </div>
        )
    }
}

export default AddNewFanficManually;