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
import FileUploader from '../../../../../components/ImageUpload/ImageUpload'
import Button from '../../../../../components/UI/Button/Button';
import './AddNewFanficManually.scss';

class AddNewFanficManually extends Component{
    fileUploadRef= React.createRef();
    fileUploadRef2= React.createRef();

    state ={
        fanficForm:fanficDataForm[0],
        formIsValid:false,
        showData:0,
        showUserData:false,
        showSaveButton:false,
        userData:{
          Follow:false,
          Favorite:false,
          status: null,
          chapter:0,
          toggleChapter:false
        },
        formData:null,
        msg:'',
        loadingFlag:false,
        saved:false,
        showUploadButton:false
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
            }
        }));
        this.props.showBtns(false);
    }

    componentWillUnmount(){this.props.onGetFandoms()}

    sendFandomToServerHandler = async (event) => {
        event.preventDefault();
        const {fandomName} = this.props,{fanficForm} = this.state;

        const formData = await buildFormData(fandomName,fanficForm);

        this.props.onGetFanficData('manually',fandomName,null,formData).then(()=>(
            this.setState({showData:1,loadingFlag:false,showSaveButton:true,formData:formData,msg:''})
        ))
    }
    saveFanficData = (save) =>{
        const {showUploadButton,formData} = this.state;
        const {similarFanfic,fandomName,fanfic} = this.props;

        
        console.log('fileUploadRef:',this.fileUploadRef.current)
        if(save){
            if(  this.fileUploadRef.current===null || 
                (this.fileUploadRef.current!==null && this.fileUploadRef.current.state.file==='') ){
                if(similarFanfic===null && !showUploadButton){
                    let msg = <p>Please upload a file</p>
                    this.setState({msg})
                }else{
                    let msg = <p>Please upload a file</p>
                    this.setState({showUploadButton:true,msg})
                }
            }else{
                this.setState({showSaveButton:false,msg:'',savedData:true})
                let anotherFiler = this.fileUploadRef2.current===null || (this.fileUploadRef2.current!==null && this.fileUploadRef2.current.state.file==='') ? false : true;
                let type= this.fileUploadRef.current.state.file.name.split('.');
                let type2= anotherFiler && this.fileUploadRef2.current.state.file.name.split('.');
                type =  type[1];
                type2 = type2[1];
                
                let fileUpload = `${fanfic.Author}_${fanfic.FanficTitle} (${fanfic.FanficID}).${type}`;
                let fileUpload2 = anotherFiler &&  `${fanfic.Author}_${fanfic.FanficTitle} (${fanfic.FanficID}).${type2}`;
                
                type = !anotherFiler ? type :  `${type},${type2}`;

                formData.append('fileName',`${fanfic.Author}_${fanfic.FanficTitle} (${fanfic.FanficID})`);
                formData.append('savedAs',type);
                formData.append(fileUpload,this.fileUploadRef.current.state.file)
                anotherFiler &&  formData.append(fileUpload2,this.fileUploadRef2.current.state.file)
        
                this.props.onSaveFanficDataToDB(fandomName,formData,null,null,null).then(()=>{
                    let msg = <p>Saved Fanfic to DB</p>
                    this.setState({msg,showUserData:true,saved:true})
                })
            }
        }else{
            let msg = <p>Didn't save fanfic</p>
            this.setState({showData:0,msg})  
        }
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
        const {fanficForm,showData,savedData,formIsValid,showUserData,userData,showSaveButton,msg,loadingFlag,saved,showUploadButton} = this.state;
        const {loading,fanfic,size,similarFanfic} = this.props;
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
                            <Grid container className='addNewFanficManually_content_form'>                           
                                <BuildForm  onSubmit={this.sendFandomToServerHandler} array={formElementsArray} check={this.inputCheckedHandler} 
                                            changed={this.inputChangedHandler} disabled={!formIsValid} getCategories={this.getCategories} buttonSendLabel='UPLOAD'/>
                            </Grid>
                        </Card>
                    : 
                    <Grid container className='addNewFanficManually_content'> 
                        <GetFanficData 
                                loading={loading} loadingFlag={loadingFlag} showData={showData} similarFanfic={similarFanfic} showSaveButton={showSaveButton}
                                fanfic={fanfic} size={size} showUserData={showUserData} userData={userData} markAs={this.markAsHandler} savedData={savedData}
                                markStatus={this.markStatusHandler} toggleChapterB={this.inputChapterHandler} saveFanficData={this.saveFanficData} msg={msg}
                         />
                         {(showUploadButton || (showSaveButton && (similarFanfic===null))) && 
                            <React.Fragment>
                                <FileUploader id='file1' ref={this.fileUploadRef}  edit={false} FandomName={fanfic.FandomName} type='doc'/>
                                <FileUploader id='file2' ref={this.fileUploadRef2} edit={false} label='Upload Another File' FandomName={fanfic.FandomName} type='doc'/>
                                {showUploadButton && <Button color="primary" clicked={()=>this.saveFanficData(true)}>Save</Button>}
                            </React.Fragment>
                         }
                         {saved && ((similarFanfic===null) || (similarFanfic!==null && similarFanfic.FanficID===fanfic.FanficID) ) && 
                            <React.Fragment>
                                <Button color="primary" clicked={()=>this.setState({saved:false,showData:0})}>Add Another One</Button>
                            </React.Fragment>
                         }
                     </Grid>

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
        onGetFandoms:           ()                                                                                  =>  dispatch(actions.getFandomsFromDB()),
        onGetFanficData:        (type,fandomName,url,fanficForm)                                                    =>  dispatch(actions.getDataOfFanfic(type,fandomName,url,fanficForm)),
        onSaveFanficDataToDB:   (fandomName,fanfic,download,url,image)                                              =>  dispatch(actions.saveDataOfFanficToDB(fandomName,fanfic,download,url,image)),
        onMarkHandler:          (userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark)             =>  dispatch(actions.addFanficToUserMarks(userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark)),
        onStatusHandler:        (userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data)    =>  dispatch(actions.addFanficToUserStatus(userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data)),
  
    };
  }
  
  export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(AddNewFanficManually));
