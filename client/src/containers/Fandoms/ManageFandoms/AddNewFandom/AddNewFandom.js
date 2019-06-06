import React,{Component} from 'react';
import axios from 'axios'
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../../store/actions';
import classes from './AddNewFandom.module.css';
import Input from '../../../../components/UI/Input/Input';
import Button from '../../../../components/UI/Button/Button';
import {updateObject} from '../../../../shared/utility';
import ImageUpload from '../../../../components/ImageUpload/ImageUpload'

class AddNewFandom extends Component{
    
    formRef = React.createRef();
    
    state ={
        fandomForm:{
            fandom_Name: {
                    label: 'Fandom Name:',
                    elementType: 'input', 
                    elementConfig:{
                        type: 'text',
                        placeholder: 'Fandom Name'
                    },
                    value:'',
                    validation: {
                        required: true
                    },
                    valid:false,
                    touched:false,
                    visible: true
            },
            search_Key: {
                label: 'Search Key:',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: 'Search Key'
                },
                value:'',
                validation: {
                    required: true
                },
                valid:false,
                touched:false,
                visible: true
            },
            auto_Save: {
                label: 'Save Fanfics Automatic to Server?',
                elementType:'select', 
                elementConfig:{
                    options: [{value: false,displayValue: 'No'},
                              {value: true,displayValue: 'Yes'}
                              ]
                },
                value:'no',
                validation:{},
                valid: true,
                visible: true
            },
            save_Method: {
                label: 'Save Methods:',
                elementType:'checkbox', 
                elementConfig:{
                    options: [{value: 'azw3',displayValue: 'AZW3',checked: false},
                              {value: 'epub' ,displayValue: 'ePub',checked: false},
                              {value: 'mobi' ,displayValue: 'Mobi',checked: false},
                              {value: 'pdf' ,displayValue: 'PDF',checked: false},
                              {value: 'html' ,displayValue: 'Html',checked: false}]
                },
                value:'',
                validation:{},
                valid: true,
                visible: false
            }
        },
        formIsValid:false,
        fandomsNames:[],
        fandomAddedFlag:0
    }

    componentDidMount(){       
        this.props.fandoms.map(fandom=>{
            this.state.fandomsNames.push(fandom.Fandom_Name)
        });
        console.log(this.state.fandomsNames)
        // this.props.initFandom();
    }

    sendFandomToServerHandler = async (event) => {
        event.preventDefault();
        let saveType = []
        this.state.fandomForm['save_Method'].elementConfig.options.map(type=>{
            type.checked && saveType.push(type.value)
        })

        const fandom = new FormData()
        fandom.append("Fandom_Name", this.state.fandomForm['fandom_Name'].value)
        fandom.append("Search_Keys", this.state.fandomForm['search_Key'].value)
        fandom.append("Auto_Save", this.state.fandomForm['auto_Save'].value)
        fandom.append("Save_Method", saveType)
        fandom.append("Fanfics_in_Fandom", 0)
        fandom.append("On_Going_Fanfics", 0)
        fandom.append("Complete_fanfics", 0)
        fandom.append("Saved_fanfics", 0)
        fandom.append("Last_Update", new Date().getTime())
        fandom.append("fandomsNames", this.state.fandomsNames)
        fandom.append('file', this.formRef.current.state.file)
        
        this.props.onAddFandom(this.state.fandomForm['fandom_Name'].value,fandom).then(res=>{
            switch  (this.props.message) {
                case 'Success':
                    this.setState({fandomAddedFlag:1})
                    console.log(this.state.fandomAddedFlag);                    
                    setTimeout(() => {
                        this.props.history.push('/manageFandoms');
                    }, 2000);
                    break;
                case 'Fandom Already Exist':
                    this.setState({fandomAddedFlag:2})
                    console.log(this.state.fandomAddedFlag);
                    break;
                case 'Error':
                    this.setState({fandomAddedFlag:3})
                    console.log(this.state.fandomAddedFlag);
                    break;
            }  
        });
        

        


    }

    checkValidity = (value,rules) =>{
        let isValid = true;
    
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }
    
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
    
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }
    
        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }
        return isValid;
    }

    inputCheckedHandler = (event)=>{
        let options = []
        this.state.fandomForm['save_Method'].elementConfig.options.map(function(check) {
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
        });

        const updatedFormElement = updateObject(this.state.fandomForm['save_Method'],{
            elementConfig:{
                options:options
            }
        });
        const updatedFandomForm = updateObject(this.state.fandomForm,{
            ['save_Method']:updatedFormElement
        })

        this.setState({fandomForm: updatedFandomForm});
    }

    inputChangedHandler = (event,inputIdentifier) =>{

        const updatedFormElement = updateObject(this.state.fandomForm[inputIdentifier],{
            value: event.target.value,
            valid: this.checkValidity(event.target.value, this.state.fandomForm[inputIdentifier].validation),
            touched: true,
        });
        let updatedFandomForm = null;
        

        if(inputIdentifier==='auto_Save'){
            const updatedFormElement1 = updateObject(this.state.fandomForm['save_Method'],{
                visible: JSON.parse(event.target.value)
            });

            updatedFandomForm = updateObject(this.state.fandomForm,{
                [inputIdentifier]:updatedFormElement,
                ['save_Method']:updatedFormElement1
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
                            checked={(event) => this.inputCheckedHandler(event,formElement.id)}
                            changed={(event) => this.inputChangedHandler(event,formElement.id)}/>
                ))}                
                <Button  btnType="Success" disabled={!this.state.formIsValid}>ADD</Button>
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
        return(
            <div>
                <h3>Add New Fandom</h3>
                <div className={classes.FormBox}>
                    <div className={classes.ImageDiv}>
                        <ImageUpload ref={this.formRef}/>
                    </div>
                    <div className={classes.FormDiv}>
                        {form}
                    <div>
                        {addFandomStatus}
                    </div>
                    </div>
                    <div className={classes.Clear}></div>
                </div>
            </div>
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
        onGetFandoms:   () => dispatch(actions.getFandomsFromDB()),
        onAddFandom:    (fandom_Name,fandom) => dispatch(actions.addFandomToDB(fandom_Name,fandom))
    };
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(AddNewFandom));

