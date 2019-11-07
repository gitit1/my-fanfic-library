import React,{Component} from 'react';
import {connect} from 'react-redux';
import { Link } from "react-router-dom";

import * as actions from '../../store/actions';

import Grid from '@material-ui/core/Grid';

import Spinner from '../../components/UI/Spinner/Spinner';
import Container from '../../components/UI/Container/Container';
import IndexContainer from './components/IndexContainer/IndexContainer';
import IndexFandoms from './components/Sections/Fandoms/Fandoms'
import LatestUpdates from './components/Sections/LatestUpdates/LatestUpdates'
import MyFanficsUpdates from './components/Sections/MyFanficsUpdates/MyFanficsUpdates'
import MyLatestActivity from './components/Sections/MyLatestActivity/MyLatestActivity'

import './Index.scss';

const LIMIT_FOR_LATEST_UPDATES = 3;
const LIMIT_FOR_MY_LATEST_ACTIVITIES = 10;

class Index extends Component{
    state={
        latestUpdates:[],
        loading:true
    }
    componentWillMount(){
        const {userEmail,isAuthenticated} = this.props;
        this.props.onGetLatestUpdates(LIMIT_FOR_LATEST_UPDATES).then(async ()=>{
             if(isAuthenticated){
                 await this.props.onGetMyLatestActivities(LIMIT_FOR_MY_LATEST_ACTIVITIES,userEmail)
                 await this.props.onGetMyFanficsUpdates(userEmail,LIMIT_FOR_MY_LATEST_ACTIVITIES,LIMIT_FOR_LATEST_UPDATES)
                 await this.props.onGetUserFandoms(userEmail)
                 this.setState({loading:false})
             }else{
                 this.setState({loading:false})
             }
         })
    }
    render(){
        const {loading} = this.state;
        const {fandoms,screenSize,smallSize,latestUpdates,myLatestActivities,isAuthenticated,myFanficsUpdates,userFandoms} = this.props;

        return(
            <Container>
                { loading ? <Spinner/> :
                    <Grid container className='index_page'>
                        {!isAuthenticated &&
                            <div className='welcome'>
                                <h1>Welcome to my fanfics library - the home of gay women couples’ fanfics</h1><br/>
                                <h4>Please register to the site in order to manage your data.</h4><br/>
                                <p>You can create reading lists , mark fanfics by finished/in progress, find fanfics from diffrent sites, find deleted fanfics and much more...</p>
                            </div> 
                        }
                        <p className='disclaimer_site'>The site is still not fully ready <b>but</b> the fanfic page functionality is working! you can add/track your favorite fanfics without the fear of it getting deleted while we continue working on the site to add more deleted fics, and much more fandoms info</p>
                        <p className='disclaimer_site'>For any suggestions please <span><Link to={'/contact'}>reach out</Link></span></p>
                        <IndexContainer header='Fandoms'>
                            <IndexFandoms numOfFandoms={fandoms.length} smallSize={smallSize} userFandoms={userFandoms}
                                          fandoms={fandoms} screenSize={screenSize}/>
                        </IndexContainer>
                        <IndexContainer header='Latest Updates'>
                            <LatestUpdates updates={latestUpdates}/>
                        </IndexContainer>
                        {isAuthenticated && 
                            <>
                                <IndexContainer header='My Fanfics Updates'>
                                    <MyFanficsUpdates updates={myFanficsUpdates}/>
                                </IndexContainer>
                                <IndexContainer header='My Latest Activities'>
                                    <MyLatestActivity updates={myLatestActivities} />
                                </IndexContainer>
                            </>
                        }

                    </Grid>
                }
            </Container>
        )
    }
}

const mapStateToProps = state =>{
    return{
        fandoms:                state.fandoms.fandoms,
        loading:                state.fandoms.loading,
        userFandoms:            state.fandoms.userFandoms,
        screenSize:             state.screenSize.size,
        smallSize:              state.screenSize.smallSize,
        latestUpdates:          state.updates.latestUpdates,
        myLatestActivities:     state.updates.myLatestActivities,
        myFanficsUpdates:       state.updates.myFanficsUpdates,
        loadingUpdate:          state.updates.loading,
        isAuthenticated:        state.auth.isAuthenticated,
        userEmail:              state.auth.user.email
    };   
}   

const mapDispatchedToProps = dispatch =>{
    return{
        onGetLatestUpdates:         (limit)                         =>  dispatch(actions.getLatestUpdates(limit)),
        onGetMyLatestActivities:    (limit,userEmail)               =>  dispatch(actions.getMyLatestActivities(limit,userEmail)),
        onGetMyFanficsUpdates:      (userEmail,limit,daysLimit)     =>  dispatch(actions.myFanficsUpdates(userEmail,limit,daysLimit)),
        onGetUserFandoms:           (userEmail)                     =>  dispatch(actions.getUserFandoms(userEmail))
    }
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Index);