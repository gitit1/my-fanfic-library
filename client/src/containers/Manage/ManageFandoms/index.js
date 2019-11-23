import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import classes from './ManageFandoms.module.css';

import * as actions from '../../../store/actions';

import Container from '../../../components/UI/Container/Container';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

import ShowFandomData from '../../Fandoms/components/ShowFandomData/ShowFandomData';
import BoxContent from './components/BoxContent';
import './ManageFandoms.scss'

class ManageFandoms extends Component{
  
  state = {
    changeImageFlag:''
  }

  routeChange = () => {
    this.props.history.push({
      pathname: '/addnewfandom',
      state: {editMode: false}
    });
  }

  deleteFandomHandler = (id,FandomName) =>{

    this.props.onDeleteFandoms(id,FandomName).then(async res=>{
      let msg = this.props.message
      switch  (msg) {
          case 'Success':                
              //this.props.onGetFandoms()
              console.log('delete Success')
              break;
          case 'Error':
              console.log('delete Error')
              break;
          default:
              console.log('delete Error')
              break;
      }  
  });
  }

  editFandomHandler = (fandom) => {
    this.props.onPostFandom(fandom)
    this.props.history.push({
      pathname: '/addnewfandom',
      state: {editMode: true}
    });
  }

  changeImage = (id,fandom) => {
    const changeImageFlag = id===0 ? null : fandom;
    this.setState({changeImageFlag});
  }

  render(){
    let page =  null;
    const {fandoms,loading,size,smallSize} = this.props;
    const {changeImageFlag} = this.state;

    if(!loading){
      if(fandoms.length === 0||fandoms ===null){
          page = (
            <div>
              <p>There Are No Fandoms On Your List - Please Add at least one</p>             
            </div>
          )
      }else{
          const sortedFandomList = fandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName))
      page = (<ShowFandomData fandoms={sortedFandomList}  
                              cellHeight={500} 
                              screenSize={size}
                              smallSize={smallSize}
                              editFandom={this.editFandomHandler} 
                              deleteFandom={this.deleteFandomHandler} 
                              boxContent={<BoxContent />} 
                              changeImage={this.changeImage}
                              changeImageFlag={changeImageFlag}/>)
          // page = (<ShowFandomData fandoms={sortedFandomList} editFandom={this.editFandomHandler} deleteFandom={this.deleteFandomHandler} screenSize={this.props.size}/>)
                  
      }
    }

    return(
      <Container header={'Manage Fandoms'}>
          { this.props.loading ?
              <Spinner/>
              :
              <div className='manageFandoms'>
                <div className={classes.AddNew}><Button clicked={this.routeChange}>Add New Fandom</Button></div>
                <div className={classes.Fandoms}>{page}</div>  
              </div>          
          }
        </Container>


      
    )
  }
};

const mapStateToProps = state =>{
  return{
      fandoms:    state.fandoms.fandoms,
      message:    state.fandoms.message,
      loading:    state.fandoms.loading,
      size:       state.screenSize.size,
      smallSize:  state.screenSize.smallSize
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      onGetFandoms:    () => dispatch(actions.getFandomsFromDB()),
      onPostFandom:    (fandom) => dispatch(actions.getFandom(fandom)),
      onDeleteFandoms: (id,FandomName) => dispatch(actions.deleteFandomFromDB(id,FandomName))
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(ManageFandoms));