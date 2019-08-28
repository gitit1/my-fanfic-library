import React,{Component} from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

import {fanficDataForm} from './assets/FanficDataForm';
import BuildForm from '../../../ManageFandoms/components/AddNewFandom/components/BuildForm'
import {updateObject} from '../../../../../utils/sharedFunctions';
import {checkValidity} from '../../../../../components/Forms/functions';
import ImageUpload from '../../../../../components/ImageUpload/ImageUpload'

import './AddNewFanficManually.scss';

class AddNewFanficManually extends Component{
    
    state ={
        fanficForm:fanficDataForm[0],
        formIsValid:false,
        fandomAddedFlag:0,
        editMode:false
    }

    componentWillMount(){
        this.setState(prevState =>({
            fanficForm: {
                ...prevState.fanficForm,
                'PublishDate': {
                    ...prevState.fanficForm['PublishDate'],
                    value: new Date()
                },
                'UpdateDate': {
                    ...prevState.fanficForm['UpdateDate'],
                    value: new Date()
                }
        }}));
    }
    sendFandomToServerHandler = () => {
        return
    }

    inputCheckedHandler = (event) => {

    }

    inputChangedHandler = (event,inputIdentifier) => {
        const updatedFormElement = updateObject(this.state.fanficForm[inputIdentifier],{
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.fanficForm[inputIdentifier].validation),
            touched: true,
        });
        let updatedFanficForm = null;
        

        updatedFanficForm = updateObject(this.state.fanficForm,{
            [inputIdentifier]:updatedFormElement
        })   

        let formIsValid = true;
        for(let inputIdentifier in updatedFanficForm){
            formIsValid = updatedFanficForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({fanficForm: updatedFanficForm, formIsValid: formIsValid});  
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
            <div className='addNewFanficManually'>
                <Card className='addNewFanficManually_card'>
                    <Grid container className='addNewFanficManually_grid'>
                        <Grid item xs={3} className='addNewFanficManually_file'>
                            {/* <ImageUpload label='Please Select Main Image' imageLabel='Main Image'/> */}
                            <p>upload file</p>
                        </Grid>
                        <Grid item xs={9} className='addNewFanficManually_content'>
                            <BuildForm onSubmit={this.sendFandomToServerHandler} array={formElementsArray} check={this.inputCheckedHandler} 
                                    changed={this.inputChangedHandler} disabled={!formIsValid} buttonSendLabel='UPLOAD'/>
                        </Grid>
                    </Grid>
                </Card>
            </div>
        )
    }
}

export default AddNewFanficManually;