import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import classes from './ManageFandoms.module.css';

import * as actions from '../../../store/actions';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Container from '../../../components/UI/Container/Container';


import ShowFandomData from './ShowFandomData/ShowFandomData';


class ManageFandoms extends Component{


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

  render(){
    let page =  null
    if(!this.props.loading){
      if(this.props.fandoms.length === 0||this.props.fandoms ===null){
          page = (
            <div>
              <p>There Are No Fandoms On Your List - Please Add at least one</p>             
            </div>
          )
      }else{
          const sortedFandomList = this.props.fandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName))
          page = (<ShowFandomData 
                                  fandoms={sortedFandomList}
                                  editFandom={this.editFandomHandler}
                                  deleteFandom={this.deleteFandomHandler}/>)
                  
      }
    }

    return(
      <Container header={'My Fandoms'}>
          { this.props.loading ?
              <Spinner/>
              :
              <React.Fragment>
                <div className={classes.Fandoms}>
                  {page}
                </div>  
                <div className={classes.Clear}></div>
              </React.Fragment>
          
          }
        </Container>


      
    )
  }
};

const mapStateToProps = state =>{
  return{
      fandoms:    state.fandoms.fandoms,
      message:    state.fandoms.message,
      loading:    state.fandoms.loading
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