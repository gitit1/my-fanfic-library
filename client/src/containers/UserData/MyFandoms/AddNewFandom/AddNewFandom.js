import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../../store/actions';
import classes from './AddNewFandom.module.css';

import Input from '../../../../components/UI/Input/Input';
import Button from '../../../../components/UI/Button/Button';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Container from '../../../../components/UI/Container/Container';


import {updateObject} from '../../../../utils/sharedFunctions';
import ImageUpload from '../../../../components/ImageUpload/ImageUpload'

import {fandomGeneralForm} from '../../../../components/Forms/FandomGeneralDataForm';
import {checkValidity} from '../../../../components/Forms/functions';

class AddNewFandom extends Component{
    
    formRef = React.createRef();
    
    state ={
        fandomForm:fandomGeneralForm[0],
        formIsValid:false,
        fandomAddedFlag:0,
        editMode:false,
        imageName:null
    }
  
    componentWillMount(){
              
        if(this.props.fandom!==null){
            this.setState({
                editMode:true,
            })
            this.editFandomInitialState()
        }
    }
    // componentWillUnmount(){
    //     this.props.onLeavingPage();
    // }
    

    editFandomInitialState = () =>{
        let options =[];
        let initialOptions = this.props.fandom['SaveMethod'];
        this.state.fandomForm['SaveMethod'].elementConfig.options.map(check=>{
            if(initialOptions.includes(check.value)){
                options.push({
                    ...check,
                    checked: true
                })
            }else{
                options.push({
                    ...check
                })
            }
            return null
        });

        this.setState(prevState =>({
            fandomForm: {
                ...prevState.fandomForm,
                'FandomName': {
                    ...prevState.fandomForm['FandomName'],
                    value: this.props.fandom['FandomName'],
                    valid: true,
                    disabled: true
                },
                'SearchKeys':{
                    ...prevState.fandomForm['SearchKeys'],
                    value: this.props.fandom['SearchKeys'],
                    valid: true                 
                },
                'AutoSave':{
                    ...prevState.fandomForm['AutoSave'],
                    value: JSON.parse(this.props.fandom['AutoSave'])              
                },
                'SaveMethod':{
                    ...prevState.fandomForm['SaveMethod'],
                    visible: JSON.parse(this.props.fandom['AutoSave']),
                    'elementConfig':{
                        ...prevState.fandomForm['SaveMethod'].elementConfig,
                        options:options
                    }           
                }
            },
            formIsValid:true,
            imageName: this.props.fandom.Image_Name_Main
        }));
    }


    sendFandomToServerHandler = (event) => {
        event.preventDefault();

        let fandomsNames = [];
        this.props.fandoms.map(fandom=>(
            fandomsNames.push(fandom.FandomName)
        ));

        this.setState({uploading:true})
        let saveType = []
        this.state.fandomForm['SaveMethod'].elementConfig.options.map(type=>{
            type.checked && saveType.push(type.value)
            return null
        })
        const fandomName = this.state.fandomForm['FandomName'].value;

        let fandom = new FormData();
        fandom.append("FandomName", fandomName)
        fandom.append("SearchKeys", this.state.fandomForm['SearchKeys'].value)
        fandom.append("AutoSave",   this.state.fandomForm['AutoSave'].value)
        fandom.append("SaveMethod", saveType)
        fandom.append("LastUpdate", new Date().getTime())
        fandom.append("fandomsNames", fandomsNames)
        this.state.editMode &&  fandom.append("FandomID", this.props.fandom.id)
        this.state.editMode &&  fandom.append("", this.props.fandom.Image_Name_Main)
        fandom.append('file', this.formRef.current.state.file)

        let image = (this.formRef.current.state.file===undefined
                      ||this.formRef.current.state.file===null
                      ||!this.formRef.current.state.file) ? false : true;
        let imageDate = new Date().getTime();
        let mode =  this.state.editMode ? 'edit' : 'add';
        
        if(this.formRef.current.state.file.name){
            this.setState({imageName:fandomName+'_'+imageDate+'.'+this.formRef.current.state.file.name.split('.')[1]});
        }


        this.props.onAddFandom(this.state.fandomForm['FandomName'].value,mode,fandom,image,imageDate).then(()=>{
        
            switch  (this.props.message) {
                case 'Success':
                    this.setState({fandomAddedFlag:1})             
                    setTimeout(() => {
                        this.props.history.push('/manageFandoms');
                    }, 1000);
                    break;
                case 'Fandom Already Exist':
                    this.setState({fandomAddedFlag:2})
                    break;
                case 'Error':
                    this.setState({fandomAddedFlag:3})
                    break;
                default:
                    //alert(this.props.message); 
                    break;           
            }    
        });      
        //this.setState({fandomName:this.state.fandomForm['FandomName'].value});
        // this.setState({editMode:false,uploading:false});
        
        return null

    }

    inputCheckedHandler = (event)=>{
        let options = []
        this.state.fandomForm['SaveMethod'].elementConfig.options.map(function(check) {
            if(check.value === event.target.value){
                options.push({
                    ...check,
                    checked: event.target.checked
                })
            }else{
                options.push({
                    ...check
                })
            }
            return null;
        });


        this.setState(prevState =>({
            fandomForm: {
                ...prevState.fandomForm,
                'SaveMethod':{
                    ...prevState.fandomForm['SaveMethod'],
                    'elementConfig':{
                        ...prevState.fandomForm['SaveMethod'].elementConfig,
                        options:options
                    }           
                }
            }
        }));

    }

    inputChangedHandler = (event,inputIdentifier) =>{

        const updatedFormElement = updateObject(this.state.fandomForm[inputIdentifier],{
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.fandomForm[inputIdentifier].validation),
            touched: true,
        });
        let updatedFandomForm = null;
        

        if(inputIdentifier==='AutoSave'){
            const updatedFormElement1 = updateObject(this.state.fandomForm['SaveMethod'],{
                visible: JSON.parse(event.target.value)
            });

            updatedFandomForm = updateObject(this.state.fandomForm,{
                [inputIdentifier]:updatedFormElement,
                'SaveMethod':updatedFormElement1
            })
        }else{
            updatedFandomForm = updateObject(this.state.fandomForm,{
                [inputIdentifier]:updatedFormElement
            })            
        }

        let formIsValid = true;
        for(let inputIdentifier in updatedFandomForm){
            formIsValid = updatedFandomForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({fandomForm: updatedFandomForm, formIsValid: formIsValid});
        
    }

    render(){
        const formElementsArray = [];
        for(let key in this.state.fandomForm){
            formElementsArray.push({
                id:key,
                config: this.state.fandomForm[key]
            })
        }
        let form = (
            <form onSubmit={this.sendFandomToServerHandler}>
                {formElementsArray.map(formElement=>(
                        <Input
                            label={formElement.config.label}
                            key={formElement.id}
                            elementType={formElement.config.elementType} 
                            elementConfig={formElement.config.elementConfig} 
                            value={formElement.config.value} 
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            visible={formElement.config.visible}
                            disabled={formElement.config.disabled}
                            checked={(event) => this.inputCheckedHandler(event,formElement.id)}
                            changed={(event) => this.inputChangedHandler(event,formElement.id)}/>
                ))}
                <br/>                               
                <Button  btnType="Success" disabled={!this.state.formIsValid}>SEND</Button>
                {/* <Button  btnType="Success" disabled={!this.state.formIsValid}>{this.state.editMode ? 'EDIT': 'ADD'} </Button> */}
            </form>
        );
        let addFandomStatus = null;
        switch (this.state.fandomAddedFlag) {
            case 1:
                addFandomStatus = <p className={classes.Message} style={{color:'green'}}>Fandom Added Successfully</p>;
                break;               
            case 2:
                addFandomStatus = <p className={classes.Message} style={{color:'red'}}>Fandom Alredy Exsist!!</p>;
                break;
            case 3:
                addFandomStatus = <p className={classes.Message} style={{color:'red'}}>There was an error</p>;
                break;   
            default:
                addFandomStatus = null;
                break;             
        }
        let header = (this.state.editMode && !this.props.loading) ? `Edit ${this.state.fandomForm['FandomName'].value} Fandom` : 'Add New Fandom'
        let page = (this.props.loading) ? <Container><Spinner/></Container> : (
            <Container header={header}>
                <div className={classes.FormBox}>
                    <div className={classes.ImageDiv}>
                        <ImageUpload 
                                        ref={this.formRef} 
                                        edit={this.state.editMode} 
                                        FandomName={this.state.fandomForm['FandomName'].value} 
                                        fileName={this.state.imageName}/>
                    </div>
                    <div className={classes.FormDiv}>
                        {form}
                    <div>
                        {addFandomStatus}
                    </div>
                    </div>
                    <div className={classes.Clear}></div>
                </div>
            </Container>
        );
        return(
            page
        );
    }
}


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
        onGetFandoms:       ()                                          =>      dispatch(actions.getFandomsFromDB()),
        onAddFandom:        (FandomName,mode,fandom,image,imageDate)    =>      dispatch(actions.addFandomToDB(FandomName,mode,fandom,image,imageDate)),
        onPostFandom:       (fandom)                                    =>      dispatch(actions.getFandom(fandom))

    };
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(AddNewFandom));

