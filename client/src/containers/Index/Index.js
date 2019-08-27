import React,{Component} from 'react';
import {connect} from 'react-redux';

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
                 this.setState({loading:false})
             }else{
                 this.setState({loading:false})
             }
         })
    }
    render(){
        const {loading} = this.state;
        const {fandoms,screenSize,smallSize,latestUpdates,myLatestActivities,isAuthenticated,myFanficsUpdates} = this.props;
        //IndexFandoms
        const shuffledFandoms = fandoms.sort(() => 0.5 - Math.random());
        const selectedFandoms = (screenSize==='m'|screenSize==='xm') ? shuffledFandoms.slice(0, 6) : screenSize!=='l' ? shuffledFandoms.slice(0, 3) : shuffledFandoms.slice(0, 9);
        const cols = (fandoms.length < 6||screenSize==='m'|screenSize==='xm') ? 3 : screenSize!=='l' ? 1 : 4
        
        return(
            <Container>
                { loading ? <Spinner/> :
                    <Grid container className='index_page'>
                        <IndexContainer header='Fandoms'>
                            <IndexFandoms cols={cols} numOfFandoms={fandoms.length} smallSize={smallSize} 
                                          fandoms={selectedFandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName))}/>
                        </IndexContainer>
                        <IndexContainer header='Latest Updates'>
                            <LatestUpdates updates={latestUpdates}/>
                        </IndexContainer>
                        {isAuthenticated && 
                            <React.Fragment>
                                <IndexContainer header='My Fanfics Updates'>
                                    <MyFanficsUpdates updates={myFanficsUpdates}/>
                                </IndexContainer>
                                <IndexContainer header='My Latest Activities'>
                                    <MyLatestActivity updates={myLatestActivities} />
                                </IndexContainer>
                            </React.Fragment>
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
        onGetMyFanficsUpdates:      (userEmail,limit,daysLimit)     =>  dispatch(actions.myFanficsUpdates(userEmail,limit,daysLimit))
    }
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Index);

//TODO: NEED TO BE FROM SERVER