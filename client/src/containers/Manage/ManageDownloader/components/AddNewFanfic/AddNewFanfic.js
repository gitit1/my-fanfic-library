import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../../../store/actions';

import Button from '../../../../../components/UI/Button/Button';
import Spinner from '../../../../../components/UI/Spinner/Spinner';

import './style/managefanfics.scss';

import UrlForSearch from './components/urlForSearch'
import ShowFanficData from './components/showFanficData/showFanficData'

class OtherSitesDownloader extends Component{
    state = {
      url:'',
      loadingFlag:true,
      showData:false,
      msg:'',
      showUserData:false,
      showSaveButton:false,
      userData:{
        Follow:false,
        Favorite:false,
        status: null,
        chapter:0,
        toggleChapter:false
      }
    }

    getFanficData = () => {
        const {url} = this.state;
        this.setState({loadingFlag:true,showData:false});

        if(url===''){
          this.setState({msg:'please enter an url'})
        }else{
          this.setState({msg:''})

          const {switches,fandomName} = this.props, download = switches.save;

          this.props.onGetFanficData(url,fandomName,download).then(()=>{
            !this.props.fanfic 
              ? this.setState({loadingFlag:false,msg:'This is Acceptable URL',showSaveButton:false}) 
              : this.setState({loadingFlag:false,showData:true,showSaveButton:true});    
          });
      }
    } 

    saveFanficData = (save)=>{
      console.log('saveFanficData')
      const {url} = this.state
      const {fandomName,fanfic,switches} = this.props
      if(save){
          this.setState({showData:true,showUserData:true})
          this.props.onSaveFanficDataToDB(fandomName,fanfic,switches.save,url,false).then((res=>{
              let msg = <p>Saved Fanfic to DB</p>
              this.setState({msg,showSaveButton:false})
          }))
      }else{
          let msg = <p>Didn't save fanfic</p>
          this.setState({showData:false,msg})   
      }
    }

    inputChangedHandler = (event,type)=>{
      if(type==='url'){
        this.setState({url:event.target.value})
      }else{
        this.setState({
          form:{
            ...this.state.form,
            [type]:event.target.value
          }
        })
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
      const {url,loadingFlag,showData,showUserData,userData,showSaveButton} = this.state;
      const {size,loading,fanfic,similarFanfic} = this.props;
      //TODO: CHECK IF FANFIC ALREADY EXIST
      return(            
            <div className='addNewFanfic_container'>
              <UrlForSearch url={url} inputChanged={this.inputChangedHandler}/>
              <br/>
              <Button clicked={this.getFanficData}>Show Data</Button>
              <br/>
              { (loading) ?
                <Spinner/>
                  :
                (!loadingFlag && showData) && 
                  <React.Fragment>
                    <ShowFanficData fanfic={fanfic} size={size} showUserData={showUserData} userData={userData}
                                    markAs={this.markAsHandler} markStatus={this.markStatusHandler} toggleChapterB={this.inputChapterHandler}/>
                    {showSaveButton && (similarFanfic===null) && <Button color="primary" clicked={()=>this.saveFanficData(true)}>Save</Button>}
                  </React.Fragment> 
                       
              } 
              {
                  (similarFanfic!==null && showData) &&
                  <React.Fragment>
                    {
                      similarFanfic.Source===fanfic.Source 
                        ? <p>This Fanfic already Saved!</p>
                        : <div className='addNewFanfic_similar_fanfics'>
                              <br/>
                              <p style={{color:'red'}}><b>Found similar fanfic that is already in the DB:</b></p>
                              <br/>
                              <br/>
                              <br/>
                              <ShowFanficData fanfic={similarFanfic} size={size} showUserData={showUserData}/> 
                              <br/>
                              <br/>
                              <br/>
                              <p style={{color:'red'}}><b>Are you sure you want to save it?</b></p>
                              <Button color="primary" clicked={()=>this.saveFanficData(true)}>Yes</Button>
                              <Button color="secondary" clicked={()=>this.saveFanficData(false)}>No</Button>
                          </div>
                    }
                  </React.Fragment>
                  
              }
              {this.state.msg}
            </div>


      )
  }
}

const mapStateToProps = state =>{
  return{
    //   fandoms:        state.fandoms.fandoms,
      fanfic:               state.downloader.fanfic,
      similarFanfic:        state.downloader.similarFanfic,
      loading:              state.downloader.loading,
      userEmail:            state.auth.user.email,
      size:                 state.screenSize.size
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      onGetFanficData:        (url,fandomName,download,image)                                                   =>  dispatch(actions.getDataOfFanfic(url,fandomName,download,image)),
      onSaveFanficDataToDB:   (fandomName,fanfic,download,url,image)                                            =>  dispatch(actions.saveDataOfFanficToDB(fandomName,fanfic,download,url,image)),
      onMarkHandler:          (userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark)           =>  dispatch(actions.addFanficToUserMarks(userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark)),
      onStatusHandler:        (userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data)  =>  dispatch(actions.addFanficToUserStatus(userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data)),
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(OtherSitesDownloader));

// TODO: add checkbox for image fanfic doanload