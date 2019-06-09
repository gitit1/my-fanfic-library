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
        fandomsNames:[],
        fandomAddedFlag:0,
        editMode:false
    }
  
    componentWillMount(){
        this.props.onGetFandoms().then(()=>{
            this.props.fandoms.map(fandom=>(
                this.state.fandomsNames.push(fandom.Fandom_Name)
            ));
            console.log(this.state.fandomsNames)
        });
              
        if(this.props.fandom!=null){
            this.setState({
                editMode:true,
            })
            this.editFandomInitialState()
        }
        console.log('editMode: ',this.state.editMode)
    }
    componentWillUnmount(){
        // this.props.onLeavingPage();
    }
    

    editFandomInitialState = () =>{
        let options =[];
        let initialOptions = this.props.fandom['Save_Method'];
        this.state.fandomForm['Save_Method'].elementConfig.options.map(check=>{
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
                'Fandom_Name': {
                    ...prevState.fandomForm['Fandom_Name'],
                    value: this.props.fandom['Fandom_Name'],
                    valid: true
                },
                'Search_Keys':{
                    ...prevState.fandomForm['Search_Keys'],
                    value: this.props.fandom['Search_Keys'],
                    valid: true                 
                },
                'Auto_Save':{
                    ...prevState.fandomForm['Auto_Save'],
                    value: JSON.parse(this.props.fandom['Auto_Save'])              
                },
                'Save_Method':{
                    ...prevState.fandomForm['Save_Method'],
                    visible: JSON.parse(this.props.fandom['Auto_Save']),
                    'elementConfig':{
                        ...prevState.fandomForm['Save_Method'].elementConfig,
                        options:options
                    }           
                }
            },
            formIsValid:true
        }));
    }


    sendFandomToServerHandler = (event) => {
        event.preventDefault();
        
        let saveType = []
        this.state.fandomForm['Save_Method'].elementConfig.options.map(type=>{
            type.checked && saveType.push(type.value)
            //return null
        })

        const fandom = new FormData()
        fandom.append("Fandom_Name", this.state.fandomForm['Fandom_Name'].value)
        fandom.append("Search_Keys", this.state.fandomForm['Search_Keys'].value)
        fandom.append("Auto_Save", this.state.fandomForm['Auto_Save'].value)
        fandom.append("Save_Method", saveType)
        fandom.append("Fanfics_in_Fandom", 0)
        fandom.append("On_Going_Fanfics", 0)
        fandom.append("Complete_fanfics", 0)
        fandom.append("Saved_fanfics", 0)
        fandom.append("Last_Update", new Date().getTime())
        fandom.append("fandomsNames", this.state.fandomsNames)
        this.state.editMode &&  fandom.append("Fandom_ID", this.props.fandom.id)
        this.state.editMode &&  fandom.append("Image_Name", this.props.fandom.Image_Name)
        fandom.append('file', this.formRef.current.state.file)

        let image = (this.formRef.current.state.file===undefined
                      ||this.formRef.current.state.file===null
                      ||!this.formRef.current.state.file) ? false : true;

        let editImage = this.state.editMode && this.props.fandom.Image_Name
        
        console.log('editMode: ',this.state.editMode)
        console.log('image: ',image)
        console.log('Image_Name: ',editImage)

        // alert('sendFandomToServerHandler'); 

        let mode =  this.state.editMode ? 'edit' : 'add';

        this.props.onAddFandom(this.state.fandomForm['Fandom_Name'].value,mode,fandom,image).then(()=>{
            console.log(this.props.message);
            // alert(this.props.message);
            // console.log(res)
            // setTimeout(() => {
            //     if(this.props.message === 'Success'){
            //         // this.setState({fandomAddedFlag:1})
            //         console.log(this.state.fandomAddedFlag);                    
            //         setTimeout(() => {
            //             this.props.history.push('/manageFandoms');
            //         }, 1000);
            //     }else if(this.props.message === 'Fandom Already Exist'){
            //         // this.setState({fandomAddedFlag:2})
            //         console.log(this.state.fandomAddedFlag);
            //     }else{
            //         // this.setState({fandomAddedFlag:3})
            //         console.log(this.state.fandomAddedFlag);               
            //     }
            // }, 5000);
        });
            // switch  (this.props.message) {
            //     case 'Success':
            //             alert(this.props.message + '2'); 
            //         // this.setState({fandomAddedFlag:1})
            //         console.log(this.state.fandomAddedFlag);                    
            //         setTimeout(() => {
            //             alert(this.props.message + '3');
            //             this.props.history.push('/manageFandoms');
            //         }, 1000);
            //         break;
            //     case 'Fandom Already Exist':
            //         this.setState({fandomAddedFlag:2})
            //         console.log(this.state.fandomAddedFlag);
            //         break;
            //     case 'Error':
            //         this.setState({fandomAddedFlag:3})
            //         console.log(this.state.fandomAddedFlag);
            //         break;
            //     case '':
            //         alert('message is empty');
            //         // if(this.state.editMode){
            //         //     this.setState({editMode:true})
            //         //     this.state.editMode && this.props.onPostFandom(this.props.fandom)
            //         // }
            //         break;
            //     default:
            //         alert(this.props.message); 
            //         break;           
            // }             
        
    //    this.setState({editMode:false});

    }

    inputCheckedHandler = (event)=>{
        let options = []
        this.state.fandomForm['Save_Method'].elementConfig.options.map(function(check) {
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

        // const updatedFormElement = updateObject(this.state.fandomForm['Save_Method'],{
        //     elementConfig:{
        //         options:options
        //     }
        // });
        // const updatedFandomForm = updateObject(this.state.fandomForm,{
        //     ['Save_Method']:updatedFormElement
        // })

        // this.setState({fandomForm: updatedFandomForm});

        this.setState(prevState =>({
            fandomForm: {
                ...prevState.fandomForm,
                'Save_Method':{
                    ...prevState.fandomForm['Save_Method'],
                    'elementConfig':{
                        ...prevState.fandomForm['Save_Method'].elementConfig,
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
        

        if(inputIdentifier==='Auto_Save'){
            const updatedFormElement1 = updateObject(this.state.fandomForm['Save_Method'],{
                visible: JSON.parse(event.target.value)
            });

            updatedFandomForm = updateObject(this.state.fandomForm,{
                [inputIdentifier]:updatedFormElement,
                'Save_Method':updatedFormElement1
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
                            // value={(this.state.editMode && (formElement.id !== 'Auto_Save' && formElement.id !== 'Save_Method') ) ? this.props.fandom[formElement.id] : formElement.config.value} 
                            value={formElement.config.value} 
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            visible={formElement.config.visible}
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
        let header = (this.state.editMode && !this.props.loading) ? `Edit ${this.props.fandom['Fandom_Name']} Fandom` : 'Add New Fandom'
        let page = this.props.loading ? <Container><Spinner/></Container> : (
            <Container header={header}>
                <div className={classes.FormBox}>
                    <div className={classes.ImageDiv}>
                        <ImageUpload 
                                        ref={this.formRef} 
                                        edit={this.state.editMode} 
                                        fandomName={this.state.editMode && this.props.fandom.Fandom_Name} 
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
        onGetFandoms:       ()                                  =>      dispatch(actions.getFandomsFromDB()),
        onAddFandom:        (fandom_Name,mode,fandom,image)     =>      dispatch(actions.addFandomToDB(fandom_Name,mode,fandom,image)),
        onPostFandom:       (fandom)                            =>      dispatch(actions.getFandom(fandom)),
        onLeavingPage:      ()                                  =>      dispatch(actions.editFandomDataStart())
    };
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(AddNewFandom));

