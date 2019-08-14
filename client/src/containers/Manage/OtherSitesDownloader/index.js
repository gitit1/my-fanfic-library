import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../store/actions';

import Container from '../../../components/UI/Container/Container';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

import './style/managefanfics.scss';

import UrlForSearch from './components/UrlForSearch'
import ShowFanficData from './components/ShowFanficData'

class OtherSitesDownloader extends Component{
    state = {
      data:null,
      test:'test',
      url:'',
      loadingFlag:true
    }

    getFanficData = () => {
        const {url} = this.state
        if(url===''){
          this.setState({data:'please enter an url'})
        }else{
          this.props.onGetFanficData(url,'Vauseman',true).then(()=>{
            this.setState({loadingFlag:false});
        });
        // console.log('data:',this.state.form)
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
            <Container header={'FF/Wattpadd Downloader'}>
              <React.Fragment>
                <UrlForSearch url={this.state.url} inputChanged={this.inputChangedHandler}/>
                <Button clicked={this.getFanficData}>Show Data</Button>
                <br/>
                { (this.props.loading) ?
                  <Spinner/>
                    :
                  !this.state.loadingFlag && <ShowFanficData fanficData={this.props.fanfic}/>                  
                } 
              </React.Fragment>
          {/* TODO: add checkbox for image download*/}
          {/* TODO: add checkbox for image fanfic doanload*/}
          
            </Container>
        )
    }
}

const mapStateToProps = state =>{
  return{
      fandoms:        state.fandoms.fandoms,
      fanfic:         state.downloader.fanfic,
      loading:         state.downloader.loading
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      onGetFanficData:    (url,fandomName,download,image)  =>      dispatch(actions.getDataOfFanfic(url,fandomName,download,image))
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(OtherSitesDownloader));