import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions';
import Container from '../../../components/UI/Container/Container';

import './FullMyLatestActivity.scss'

const LIMIT_FOR_MY__LATEST_ACTIVITIES = 50;

class FullMyLatestActivity extends Component{
    state={
        loading:true
    }

    componentDidMount(){
        const {onGetMyLatestActivities,myLatestActivities,userEmail} = this.props;
        if (myLatestActivities===null){
            onGetMyLatestActivities(LIMIT_FOR_MY__LATEST_ACTIVITIES,userEmail).then(async ()=>{
                this.setState({loading:false})
            })
        }else{
            this.setState({loading:false})
        }
    }
    render(){
        const {loading} = this.state;
        const updates = this.props.myLatestActivities;
        return(
            <Container header='My Latest Activity' className='fullLatestUpdates'>
                {!loading && updates.map(activity=>{
                    const {Date,FandomName,ActivityType,Author,FanficTitle,FanficID,Source} = activity;
                    return(
                        <p key={Date}>
                            <span className={`color_${Source}`}>{Source}</span>
                            {` - ${FandomName} - ${ActivityType} - `}
                            <a target='_blank' rel="noopener noreferrer"  
                            href={(Source==='AO3') ? `https://archiveofourown.org/works/${FanficID}` : `https://www.fanfiction.net/s/${FanficID}`}>
                            {`${Author}  ${FanficTitle}`}
                            </a> 
                        </p>
                    )
                })
                }
            </Container>
        )
    }
};

const mapStateToProps = state =>{
    return{
        userEmail:              state.auth.user.email,
        myLatestActivities:     state.updates.myLatestActivities
    };   
  }

const mapDispatchedToProps = dispatch =>{
    return{
        onGetMyLatestActivities:    (limit,userEmail)               =>  dispatch(actions.getMyLatestActivities(limit,userEmail))
    }
}
export default connect(mapStateToProps,mapDispatchedToProps)(FullMyLatestActivity);