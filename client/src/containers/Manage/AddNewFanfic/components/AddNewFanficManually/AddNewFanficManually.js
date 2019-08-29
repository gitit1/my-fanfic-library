import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../../../store/actions';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

import GetFanficData from '../helpers/GetFanficData/GetFanficData'
import {fanficDataForm} from './assets/FanficDataForm';
import BuildForm from '../../../ManageFandoms/components/AddNewFandom/components/BuildForm'
import {updateObject} from '../../../../../utils/sharedFunctions';
import {checkValidity} from '../../../../../components/Forms/functions';
import {buildFormData} from './components/buildFormData';
import ImageUpload from '../../../../../components/ImageUpload/ImageUpload'

import './AddNewFanficManually.scss';

class AddNewFanficManually extends Component{
    fileUploadRef= React.createRef();

    state ={
        fanficForm:fanficDataForm[0],
        formIsValid:false,
        showData:0,
        showUserData:false,
        showSaveButton:true,
        userData:{
          Follow:false,
          Favorite:false,
          status: null,
          chapter:0,
          toggleChapter:false
        },
        msg:'',
        loadingFlag:false
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
    
    sendFandomToServerHandler = async (event) => {
        event.preventDefault();
        const {fandomName} = this.props,{fanficForm} = this.state;

        const formData = await buildFormData(fandomName,fanficForm);
        console.log('fandomName',fandomName)
        console.log('formData 1',formData)
        this.props.onGetFanficData('manually',fandomName,null,formData).then(()=>(
            this.setState({showData:1})
        ))
        
    }
    saveFanficData = () =>{
        const download = this.props.switches.save;
        const fandomName = this.props.fandomName;
        const fanfic = this.props.fanfic;
        const url = null,image=null;

        this.props.onSaveFanficDataToDB(fandomName,fanfic,download,null,null)
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

            this.setState({fanficForm: updatedFanficForm});  
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

    markStatusHandler = async (fanficId,author,fanficTitle,source,statusType,event) =>{
        const {userData} = this.state;
        const {userEmail,fandomName} = this.props;
        let newStatus = '',chapterNum =0,flag=false;
        switch (statusType) {
          case 'Finished':
              newStatus = (userData.status!==null && userData.status==='Finished') ? 'Need to Read' : 'Finished';
              await this.props.onStatusHandler(userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,newStatus);
              flag=true;
              break;
          case 'In Progress':
              if(event.key === 'Enter') {
                  chapterNum = event.target.value;
                  newStatus = 'In Progress';
                  await this.props.onStatusHandler(userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,newStatus,chapterNum);
                  flag=true;
              }
              break;
          case 'Need to Read':
              break;
          default:
              break;
        }
        if(flag){
          this.setState({
            userData:{
              ...userData,
              status:newStatus,
              chapter:chapterNum,
              toggleChpter:false
            }       
          })
        }
    }
  
    markAsHandler = (fanficId,author,fanficTitle,source,markType) =>{
    const {userData} = this.state;
    const {userEmail,fandomName} = this.props;

    this.props.onMarkHandler(userEmail,fandomName,fanficId,author,fanficTitle,markType,source,!userData[markType])
    this.setState({      
        userData:{
        ...userData,
        [markType]:!userData[markType]
        }
    })
    }

    inputChapterHandler = (id) =>{
        const {userData} = this.state;
        this.setState({
          userData:{
            ...userData,
            toggleChpter:!userData.toggleChapter
          }
        })
    }

    render(){
        const {fanficForm,showData,formIsValid,showUserData,userData,showSaveButton,msg,loadingFlag} = this.state;
        const {loading,fanfic,size,similarFanfic,fandomName} = this.props;

        const formElementsArray = [];
        for(let key in fanficForm){
            formElementsArray.push({
                id:key,
                config: fanficForm[key]
            })
        }
        return(
            <div className='addNewFanficManually'>
                {   showData===0 ? 
                        <Card className='addNewFanficManually_card'>
                            <Grid container className='addNewFanficManually_grid'>
                                <Grid item xs={3} className='addNewFanficManually_file'>
                                    <ImageUpload id='main' ref={this.fileUploadRef} edit={false} FandomName={fandomName} type='doc'/>
                                </Grid>
                                <Grid item xs={9} className='addNewFanficManually_content'>                           
                                        <BuildForm  onSubmit={this.sendFandomToServerHandler} array={formElementsArray} check={this.inputCheckedHandler} 
                                                    changed={this.inputChangedHandler} disabled={!formIsValid} buttonSendLabel='UPLOAD'/>
                                </Grid>
                            </Grid>
                        </Card>
                    : 
                        <GetFanficData 
                            loading={loading} loadingFlag={loadingFlag} showData={showData} similarFanfic={similarFanfic} showSaveButton={showSaveButton}
                            fanfic={fanfic} size={size} showUserData={showUserData} userData={userData} markAs={this.markAsHandler} 
                            markStatus={this.markStatusHandler} toggleChapterB={this.inputChapterHandler} saveFanficData={this.saveFanficData} msg={msg}
                        />
                }

            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        fandoms:              state.fandoms.fandoms,
        fanfic:               state.downloader.fanfic,
        similarFanfic:        state.downloader.similarFanfic,
        loading:              state.downloader.loading,
        userEmail:            state.auth.user.email,
        size:                 state.screenSize.size
    };   
  }
  
  const mapDispatchedToProps = dispatch =>{
    return{
        onGetFanficData:        (type,fandomName,url,fanficForm)        =>  dispatch(actions.getDataOfFanfic(type,fandomName,url,fanficForm)),
        onSaveFanficDataToDB:   (fandomName,fanfic,download,url,image)  =>  dispatch(actions.saveDataOfFanficToDB(fandomName,fanfic,download,url,image)),
    };
  }
  
  export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(AddNewFanficManually));
