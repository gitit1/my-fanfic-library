import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions';
import Container from '../../../components/UI/Container/Container';

import './FullMyFanficsUpdates.scss';

const LIMIT_FOR_LATEST_UPDATES = 7
const LIMIT_FOR_MY_FANFICS_UPDATES = 40;

class FullMyFanficsUpdates extends Component{
    state={
        loading:true
    }

    componentDidMount(){
        const {onGetMyFanficsUpdates,userEmail,myFanficsUpdates} =this.props;
        if (myFanficsUpdates===null){
            onGetMyFanficsUpdates(userEmail,LIMIT_FOR_MY_FANFICS_UPDATES,LIMIT_FOR_LATEST_UPDATES).then(async ()=>{
                this.setState({loading:false})
            })
        }else{
            this.setState({loading:false})
        }
    }
    render(){
        const {loading} = this.state;     
        const updates = this.props.myFanficsUpdates;
        return(
            <Container header='My Fanfics Updates' className='fullMyFanficsUpdates'>
                {!loading && updates.map(update=>(
                    <div className='fullMyFanficsUpdates_fanfics_box'>
                        <p key={update.FanficID}>
                            <span className={`color_${update.Source}`}>{update.Source}</span>
                            {`- ${update.FanficID} - ${update.Author} - ${update.FanficTitle} - ${update.Status} - ${update.StatusDetails}`}
                        </p>
                    </div>

                ))}  
            </Container>
        )
    }
};

const mapStateToProps = state =>{
    return{
        myFanficsUpdates:       state.updates.myFanficsUpdates,
        userEmail:              state.auth.user.email
    };   
  }

const mapDispatchedToProps = dispatch =>{
    return{
        onGetMyFanficsUpdates:      (userEmail,limit,daysLimit)     =>  dispatch(actions.myFanficsUpdates(userEmail,limit,daysLimit))
    }
}
export default connect(mapStateToProps,mapDispatchedToProps)(FullMyFanficsUpdates);