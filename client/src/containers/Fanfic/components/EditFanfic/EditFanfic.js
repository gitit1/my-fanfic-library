import React,{Component} from 'react';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

import * as actions from '../../../../store/actions';

import {updateObject} from '../../../../utils/sharedFunctions';
import {checkValidity} from '../../../../components/Forms/functions';

import BuildForm from '../../../Manage/ManageFandoms/components/AddNewFandom/components/BuildForm'
import {buildFormData} from '../../../Manage/AddNewFanfic/components/AddNewFanficManually/components/buildFormData';
import  {categories} from '../ShowFanficData/FanficData/Categories/assets/categoriesList'

import './EditFafnic.scss'

class EditFanfic extends Component{   

    state ={
        fanficForm:{
            FanficID: {
                    label: '(*) Fanfic ID:',
                    classNameCustom:'FanficID',
                    elementType: 'input', 
                    elementConfig:{
                        type: 'number',
                        placeholder: '(*) Fanfic ID'
                    },
                    value:this.props.fanfic.FanficID,
                    validation: {
                        required: true,
                        minLength:4
                    },
                    valid:true,
                    touched:false,
                    visible: true,
                    disabled:false
            },
            Rating: {
                label: 'Rating',
                classNameCustom:'Rating',
                elementType:'select', 
                elementConfig:{
                    options: [
                                {value: 'none',displayValue: 'None'},
                                {value: 'general',displayValue: 'General'},
                                {value: 'teen',displayValue: 'Teen'},
                                {value: 'mature',displayValue: 'Mature'},
                                {value: 'explicit',displayValue: 'Explicit'},       
                              ]
                },
                value:this.props.fanfic.Rating,
                validation:{},
                valid: true,
                visible: true,
                disabled:false
            },
            FanficTitle: {
                label: '(*) Fanfic Title:',
                classNameCustom:'FanficTitle',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: '(*) Fanfic Title'
                },
                value:this.props.fanfic.FanficTitle,
                validation: {
                    required: true
                },
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Author: {
                label: '(*) Author:',
                classNameCustom:'Author',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: '(*) Author'
                },
                value:this.props.fanfic.Author,
                validation: {
                    required: true
                },
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            FanficURL: {
                label: 'Fanfic URL:',
                classNameCustom:'FanficURL',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: 'Fanfic URL'
                },
                value:this.props.fanfic.URL,
                validation: {},
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            AuthorURL: {
                label: 'Author URL:',
                classNameCustom:'AuthorURL',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: 'Author URL'
                },
                value:this.props.fanfic.AuthorURL,
                validation: {},
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            FandomsTags: {
                label: 'Fandoms Tags:',
                classNameCustom:'FandomsTags',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: 'Fandoms Tags - Seperate by comma , Example: "tag 1,tag 2"'
                },
                value:this.props.fanfic.FandomsTag!==null ? this.props.fanfic.FandomsTag.join(',') : '',
                validation: {},
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Warnings: {
                label: 'Warnings:',
                classNameCustom:'Warnings',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: 'Warnings - Seperate by comma , Example: "tag 1,tag 2"'
                },
                value:this.props.fanfic.Tags.filter(fic=>Object.keys(fic)[0]==='warnings')[0] ? this.props.fanfic.Tags.filter(fic=>Object.keys(fic)[0]==='warnings')[0]['warnings'] : '',
                validation: {},
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Relationships: {
                label: 'Relationships:',
                classNameCustom:'Relationships',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: 'Relationships - Seperate by comma , Example: "tag 1,tag 2"'
                },
                value:this.props.fanfic.Tags.filter(fic=>Object.keys(fic)[0]==='relationships')[0] ? this.props.fanfic.Tags.filter(fic=>Object.keys(fic) && Object.keys(fic)[0]==='relationships')[0]['relationships'] : '',
                validation: {},
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Characters: {
                label: 'Characters:',
                classNameCustom:'Characters',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: 'Characters - Seperate by comma , Example: "tag 1,tag 2"'
                },
                value:this.props.fanfic.Tags.filter(fic=>Object.keys(fic)[0]==='characters')[0] ? this.props.fanfic.Tags.filter(fic=>Object.keys(fic)[0]==='characters')[0]['characters'] : '',
                validation: { },
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Tags: {
                label: 'Free Tags:',
                classNameCustom:'Tags',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: 'Free Tags - Seperate by comma , Example: "tag 1,tag 2"'
                },
                value: this.props.fanfic.Tags.filter(fic=>Object.keys(fic)[0]==='tags')[0] ?  this.props.fanfic.Tags.filter(fic=>Object.keys(fic)[0]==='tags')[0]['tags'] : '',
                validation: { },
                valid:true,
                touched:false,
                visible:true,
                disabled:false
            },
            SeriesName: {
                label: 'Series:',
                classNameCustom:'SeriesName',
                elementType:'input', 
                elementConfig:{
                    type: 'text',
                    placeholder: 'Series the fanfic part of'
                },
                value:this.props.fanfic.Series ? this.props.fanfic.Series : '',
                validation: { },
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            SeriesNumber: {
                label: 'SeriesNumber:',
                classNameCustom:'SeriesNumber',
                elementType:'input', 
                elementConfig:{
                    type: 'number',
                    placeholder: 'The number of the fanfic in the series (part XXX)'
                },
                value:this.props.fanfic.SeriesPart ? this.props.fanfic.SeriesPart : '',
                validation: { },
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Categories: {
                label: 'Categories:',
                classNameCustom:'Categories',
                elementType:'auto-select', 
                elementConfig:{
                    suggestions:  categories,
                    placeholder: 'Select Categories'
                },
                value:this.props.fanfic.Categories,
                validation: { },
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Summary: {
                label: 'Summary:',
                classNameCustom:'Summary',
                elementType:'textarea', 
                elementConfig:{
                    type: 'text',
                    placeholder: '(*) Summary'
                },
                value:this.props.fanfic.Description,
                validation: {
                    required: true
                },
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Source: {
                label: '(*) Source',
                classNameCustom:'Source',
                elementType:'select', 
                elementConfig:{
                    options: [
                                {value: 'Backup',displayValue: 'Backup'},
                                {value: 'Patreon',displayValue: 'Patreon'},
                                {value: 'Tumblr',displayValue: 'Tumblr'},
                                {value: 'Wattpad',displayValue: 'Wattpad'}
                              ]
                },
                value:this.props.fanfic.Source,
                validation: {
                    required: true
                },
                valid: true,
                visible: true,
                disabled:false
            },
            PublishDate: {
                label: '(*) Publish Date',
                classNameCustom:'PublishDate',
                elementType:'date', 
                value:'',
                validation:{},
                valid: true,
                visible: true,
                disabled:false
            },
            UpdateDate: {
                label: '(*) Update Date',
                classNameCustom:'UpdateDate',
                elementType:'date', 
                value:'',
                validation:{},
                valid: true,
                visible: true,
                disabled:false
            },
            Language: {
                label: 'Language',
                classNameCustom:'Language',
                elementType:'select', 
                elementConfig:{
                    options: [
                                {value: 'English',displayValue: 'English'},
                              ]
                },
                value:'English',
                validation:{},
                valid: true,
                visible: true,
                disabled:false
            },
            Words: {
                label: '(*) Words:',
                classNameCustom:'Words',
                elementType:'input', 
                elementConfig:{
                    type: 'number',
                    placeholder: '(*) Words'
                },
                value:this.props.fanfic.Words,
                validation: {
                    required: true
                },
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            NumberOfChapters: {
                label: '(*) Chapters:',
                classNameCustom:'NumberOfChapters',
                elementType:'input', 
                elementConfig:{
                    type: 'number',
                    placeholder: '(*) Chapters'
                },
                value:this.props.fanfic.NumberOfChapters,
                validation: {
                    required: true
                },
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Complete: {
                label: '(*) Complete',
                classNameCustom:'Complete',
                elementType:'select', 
                elementConfig:{
                    options: [{value: false,displayValue: 'No'},
                              {value: true,displayValue: 'Yes'}
                              ]
                },
                value:this.props.fanfic.Complete,
                validation: {
                    required: true
                },
                valid: true,
                visible: true,
                disabled:false
            },
            Oneshot: {
                label: 'Oneshot',
                classNameCustom:'Oneshot',
                elementType:'select', 
                elementConfig:{
                    options: [{value: false,displayValue: 'No'},
                              {value: true,displayValue: 'Yes'}
                              ]
                },
                value:this.props.fanfic.Oneshot,
                validation:{},
                valid: true,
                visible: true,
                disabled:false
            },
            Comments: {
                label: 'Comments (Reviews):',
                classNameCustom:'Comments',
                elementType:'input', 
                elementConfig:{
                    type: 'number',
                    placeholder: 'Comments (Reviews)'
                },
                value:this.props.fanfic.Comments,
                validation: {},
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Kudos: {
                label: 'Kudos (Favs)',
                classNameCustom:'Kudos',
                elementType:'input', 
                elementConfig:{
                    type: 'number',
                    placeholder: 'Kudos (Favs)'
                },
                value:this.props.fanfic.Kudos,
                validation: {},
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Hits: {
                label: 'Hits:',
                classNameCustom:'Hits',
                elementType:'input', 
                elementConfig:{
                    type: 'number',
                    placeholder: 'Hits'
                },
                value:this.props.fanfic.Hits,
                validation: {},
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            },
            Bookmarks: {
                label: 'Bookmarks (Follows):',
                classNameCustom:'Bookmarks',
                elementType:'input', 
                elementConfig:{
                    type: 'number',
                    placeholder: 'Bookmarks (Follows)'
                },
                value:this.props.fanfic.Bookmarks,
                validation: {},
                valid:true,
                touched:false,
                visible: true,
                disabled:false
            }
        },
        formIsValid:true,
        formData:null,
        msg:'',
        loadingFlag:false
    }

    componentWillMount(){
        console.log('manually...componentWillMount()')
        const PublishDate = this.props.fanfic.PublishDate ? new Date(this.props.fanfic.PublishDate) : new Date();
        const UpdateDate = this.props.fanfic.LastUpdateOfFic ? new Date(this.props.fanfic.LastUpdateOfFic) : new Date();
        this.setState(prevState =>({
            fanficForm: {
                ...prevState.fanficForm,
                'PublishDate': {
                    ...prevState.fanficForm['PublishDate'],
                    value: PublishDate
                },
                'UpdateDate': {
                    ...prevState.fanficForm['UpdateDate'],
                    value: UpdateDate
                }
            }
        }));
    }

    saveDataToServer = async (event) =>{
        event.preventDefault();
        const formData = await buildFormData(this.props.fandomName,this.state.fanficForm);
        console.log('formData:',formData)
        this.props.onUpdateFanficData(this.props.fandomName,formData).then(()=>{
            let msg = <p>Saved Fanfic to DB</p>
            this.setState({msg},()=>{
                setTimeout(() => {
                    this.props.back(null,true)
                }, 2000);
            })
        })
    }

    getCategories = (categoriesArr) =>{
        this.setState(prevState =>({
            fanficForm: {
                ...prevState.fanficForm,
                'Categories':{
                    ...prevState.fanficForm['Categories'],
                    value:categoriesArr          
                }
            }
        }));
    }
    
    inputChangedHandler = (event,inputIdentifier) => {

        if(inputIdentifier==='PublishDate'||inputIdentifier==='UpdateDate'){
            const date = new Date(event);
            const updatedFormElement = updateObject(this.state.fanficForm[inputIdentifier],{
                value: date,
                touched: true
            });

            const updatedFanficForm = updateObject(this.state.fanficForm,{
                [inputIdentifier]:updatedFormElement
            })  

            this.setState({fanficForm: updatedFanficForm,msg:''});  
        }else{
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
    }

    render(){
        const {fanficForm,formIsValid,msg} = this.state;
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
                    <Grid container className='addNewFanficManually_content_form'>                           
                        <BuildForm  onSubmit={this.saveDataToServer} array={formElementsArray} check={this.inputCheckedHandler} fanfic={this.props.fanfic}
                                    changed={this.inputChangedHandler} disabled={!formIsValid} getCategories={this.getCategories} buttonSendLabel='UPDATE' exist={this.props.fanfic.Categories}/>
                        <div className='addNewFanficManually_back_button_div' >
                            <Button  type="submit" variant="contained" className='addNewFanficManually_back_button'  onClick={()=>this.props.back(null,false)}>Back</Button>
                        </div>
                        <div className='addNewFanficManually_msgDiv' >{msg}</div>
                        <div className='clear'></div>
                    </Grid>
                </Card>
            </div>
        )
    }
}

const mapDispatchedToProps = dispatch =>{
    return{
        onUpdateFanficData:        (fandomName,fanficForm)    =>  dispatch(actions.updateFanficData(fandomName,fanficForm)),
    };
}

export default connect(null,mapDispatchedToProps)(EditFanfic);