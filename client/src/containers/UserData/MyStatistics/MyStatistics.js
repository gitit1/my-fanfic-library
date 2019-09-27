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



const RADIAN = Math.PI / 180;

class MyStatistics extends Component{

  state = {
    fandomData:null,
    loading:true
  }

  componentDidMount(){
    this.props.OnGetFullUserData(this.props.userEmail).then(()=>
         getFandomsNumbers(this.props.userData).then(fandomData=>{
            this.setState({fandomData:fandomData,loading:false})
         })
    );
  }


  render(){
    const {fandomData,loading} = this.state;
    const {fandoms,userData} = this.props;

    return(
      <div className={classes.MyStatistics}>
        <Container header={'My Tracker'} >
              { 
                  loading ?
                  <Spinner />
                  :
                  <React.Fragment>
                        <div className={classes.GeneralBarChart}>
                          <GeneralBarChart data={fandomData}/>
                          <GeneralAllFandomData data={fandomData} />
                        </div>
                        <Grid  className={classes.StatisticsGrid} container>
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
      OnGetFullUserData:    (userEmail) => dispatch(actions.getFullUserData(userEmail)),

  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(MyStatistics));