import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../../../store/actions';

import Button from '../../../../../components/UI/Button/Button';
import Spinner from '../../../../../components/UI/Spinner/Spinner';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import './style/managefanfics.scss';

import UrlForSearch from './components/urlForSearch'
import ShowFanficData from './components/showFanficData'

class OtherSitesDownloader extends Component{
    state = {
      url:'',
      loadingFlag:true,
      showData:false,
      msg:''
    }

    getFanficData = () => {
        const {url} = this.state
        if(url===''){
          this.setState({msg:'please enter an url'})
        }else{
          this.setState({msg:''})
          const {switches,fandomName} = this.props, download = switches.save;
          this.props.onGetFanficData(url,fandomName,download).then(()=>{
            this.setState({loadingFlag:false,showData:true});
          });
      }
    } 

    saveFanficData = (save)=>{
      console.log('saveFanficData')
      const {url} = this.state
      const {fandomName,fanfic,switches} = this.props
      if(save){
          this.setState({showData:false})
          this.props.onSaveFanficDataToDB(fandomName,fanfic,switches.save,url,false).then((()=>{
              let msg = <p>Saved Fanfic to DB</p>
              this.setState({msg})
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

    render(){
        return(            
              <React.Fragment>
                <UrlForSearch url={this.state.url} inputChanged={this.inputChangedHandler}/>
                <br/>
                <Button clicked={this.getFanficData}>Show Data</Button>
                <br/>
                { (this.props.loading) ?
                  <Spinner/>
                    :
                  (!this.state.loadingFlag && this.state.showData) && <ShowFanficData fanficData={this.props.fanfic}/>             
                } 
                {
                    (this.props.similarFanfic!==null && this.state.showData) &&
                        <React.Fragment>
                            <br/>
                            <p style={{color:'red'}}><b>Found similar fanfic that is already in the DB:</b></p>
                            <br/>
                            <br/>
                            <br/>
                            <ShowFanficData fanficData={this.props.similarFanfic}/> 
                            <br/>
                            <br/>
                            <br/>
                            <p style={{color:'red'}}><b>Are you sure you want to save it?</b></p>
                            <Button color="primary" clicked={()=>this.saveFanficData(true)}>Yes</Button>
                            <Button color="secondary" clicked={()=>this.saveFanficData(false)}>No</Button>
                        </React.Fragment>
                    
                }
                {this.state.msg}
              </React.Fragment>


        )
    }
}

const mapStateToProps = state =>{
  return{
    //   fandoms:        state.fandoms.fandoms,
      fanfic:               state.downloader.fanfic,
      similarFanfic:        state.downloader.similarFanfic,
      loading:              state.downloader.loading
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      onGetFanficData:          (url,fandomName,download,image)     =>          dispatch(actions.getDataOfFanfic(url,fandomName,download,image)),
      onSaveFanficDataToDB:     (fandomName,fanfic,download,url,image)  =>      dispatch(actions.saveDataOfFanficToDB(fandomName,fanfic,download,url,image))
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(OtherSitesDownloader));

{/* TODO: add checkbox for image fanfic doanload*/}