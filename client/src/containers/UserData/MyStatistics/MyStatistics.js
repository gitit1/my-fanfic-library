import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import classes from  './MyStatistics.module.scss';

import * as actions from '../../../store/actions';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Container from '../../../components/UI/Container/Container';
import {getFandomsNumbers} from './functions/functions'
import GeneralBarChart from './components/GeneralBarChart/GeneralBarChart';
import GeneralAllFandomData from './components/GeneralAllFandomData/GeneralAllFandomData';
import FandomCard from './components/FandomCard/FandomCard';
import Grid from '@material-ui/core/Grid';

class MyStatistics extends Component{

  state = {
    fandomData:null,
    loading:true,
    noDataFlag:false
  }

  componentDidMount(){
    if(Object.entries(this.props.userData).length === 0){
      this.props.onGetFullUserData(this.props.userEmail).then(()=>{
            if(Object.entries(this.props.userData).length === 0){
              this.setState({noDataFlag:true,loading:false})
            }else{
              getFandomsNumbers(this.props.userData).then(fandomData=>{
                 this.setState({fandomData:fandomData,loading:false})
              })
            }
          });
    }else{
        getFandomsNumbers(this.props.userData).then(fandomData=>{
          this.setState({fandomData:fandomData,loading:false})
      })
    }
  }


  render(){
    const {fandomData,loading,noDataFlag} = this.state;
    const {fandoms,userData} = this.props;

    return(
      <div className={classes.MyStatistics}>
        <Container header={'My Tracker'} >
              { 
                  loading ?
                  <Spinner />
                  :
                  noDataFlag ? 
                  <React.Fragment>There is no user data please add some before checking statistics.</React.Fragment>
                  :
                  <React.Fragment>
                        <div className={classes.GeneralBarChart}>
                          <GeneralBarChart data={fandomData}/>
                          <GeneralAllFandomData data={fandomData} />
                        </div>
                        <Grid  className={classes.StatisticsGrid} container alignItems="flex-start">
                          <FandomCard userData={userData} fandomData={fandomData} fandoms={fandoms}/>
                        </Grid>    
    
                  </React.Fragment>
                  
              }
          </Container>
      </div>
 
    )
  }
};

const mapStateToProps = state =>{
  return{
      fandoms:          state.fandoms.fandoms,
      userEmail:        state.auth.user.email,
      userData:         state.auth.userData,
      message:          state.fandoms.message,
      userFandoms:      state.fandoms.userFandoms,
      loading:          state.fandoms.loading,
      size:             state.screenSize.size,
      smallSize:        state.screenSize.smallSize,
      isAuthenticated:  state.auth.isAuthenticated,
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      onGetFullUserData:    (userEmail) => dispatch(actions.getFullUserData(userEmail)),

  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(MyStatistics));