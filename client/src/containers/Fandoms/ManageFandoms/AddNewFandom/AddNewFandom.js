import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../../store/actions';
import classes from './AddNewFandom.module.css';

import Input from '../../../../components/UI/Input/Input';
import Button from '../../../../components/UI/Button/Button';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Container from '../../../../components/UI/Container/Container';


import {updateObject} from '../../../../shared/utility';
import ImageUpload from '../../../../components/ImageUpload/ImageUpload'

import {fandomGeneralForm} from '../../../../components/Forms/FandomGeneralDataForm';
import {checkValidity} from '../../../../components/Forms/functions';

class AddNewFandom extends Component{
    
    formRef = React.createRef();
    
    state ={
        fandomForm:fandomGeneralForm[0],
        formIsValid:false,
        fandomAddedFlag:0,
        editMode:false
    }
  
    componentWillMount(){
              
        if(this.props.fandom!==null){
            this.setState({
                editMode:true,
            })
            this.editFandomInitialState()
            console.log('editMode 1: ',this.state.editMode)
        }
        console.log('editMode 2: ',this.state.editMode)
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
            formIsValid:true
        }));
    }


    sendFandomToServerHandler = (event) => {
        event.preventDefault();

        let fandomsNames = [];
        //await this.props.onGetFandoms().then(()=>{
            this.props.fandoms.map(fandom=>(
                fandomsNames.push(fandom.FandomName)
            ));
            console.log('fandomsNames: ',fandomsNames)
        //});

        this.setState({uploading:true})
        let saveType = []
        this.state.fandomForm['SaveMethod'].elementConfig.options.map(type=>{
            type.checked && saveType.push(type.value)
            return null
        })

        const fandom = new FormData();
        fandom.append("FandomName", this.state.fandomForm['FandomName'].value)
        fandom.append("SearchKeys", this.state.fandomForm['SearchKeys'].value)
        fandom.append("AutoSave",   this.state.fandomForm['AutoSave'].value)
        fandom.append("SaveMethod", saveType)
        fandom.append("FanficsInFandom", 0)
        fandom.append("OnGoingFanfics", 0)
        fandom.append("CompleteFanfics", 0)
        fandom.append("SavedFanfics", 0)
        fandom.append("LastUpdate", new Date().getTime())
        fandom.append("fandomsNames", fandomsNames)
        this.state.editMode &&  fandom.append("FandomID", this.props.fandom.id)
        this.state.editMode &&  fandom.append("Image_Name", this.props.fandom.Image_Name)
        fandom.append('file', this.formRef.current.state.file)

        let image = (this.formRef.current.state.file===undefined
                      ||this.formRef.current.state.file===null
                      ||!this.formRef.current.state.file) ? false : true;

        //let editImage = this.state.editMode && this.props.fandom.Image_Name
        console.log('this.state.fandomForm[FandomName].value:',this.state.fandomForm['FandomName'].value)
        let mode =  this.state.editMode ? 'edit' : 'add';

        this.props.onAddFandom(this.state.fandomForm['FandomName'].value,mode,fandom,image).then(()=>{
        
            switch  (this.props.message) {
                case 'Success':
                    this.setState({fandomAddedFlag:1})
                    console.log(this.state.fandomAddedFlag);
                    //this.props.onGetFandoms();                   
                    setTimeout(() => {
                        this.props.history.push('/manageFandoms');
                    }, 1000);
                    break;
                case 'Fandom Already Exist':
                    this.setState({fandomAddedFlag:2})
                    console.log(this.state.fandomAddedFlag);
                    break;
                case 'Error':
                    this.setState({fandomAddedFlag:3})
                    console.log(this.state.fandomAddedFlag);
                    break;
                default:
                    //alert(this.props.message); 
                    break;           
            }    
        });      
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
        let header = (this.state.editMode && !this.props.loading) ? `Edit ${this.props.fandom['FandomName']} Fandom` : 'Add New Fandom'
        let page = (this.props.loading && this.state.uploading) ? <Container><Spinner/></Container> : (
            <Container header={header}>
                <div className={classes.FormBox}>
                    <div className={classes.ImageDiv}>
                        <ImageUpload 
                                        ref={this.formRef} 
                                        edit={this.state.editMode} 
                                        FandomName={this.state.editMode && this.props.fandom.FandomName} 
                                        fileName={this.state.editMode && this.props.fandom.Image_Name}/>
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
        onGetFandoms:       ()                                                  =>      dispatch(actions.getFandomsFromDB()),
        onAddFandom:        (FandomName,mode,fandom,image)        =>      dispatch(actions.addFandomToDB(FandomName,mode,fandom,image)),
        onPostFandom:       (fandom)                                            =>      dispatch(actions.getFandom(fandom))
        //onLeavingPage:      ()                                  =>      dispatch(actions.editFandomDataStart())
    };
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(AddNewFandom));

