import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions';
import Container from '../../../components/UI/Container/Container';

import './FullLatestUpdates.scss';

const LIMIT_FOR_LATEST_UPDATES = 7;

class FullLatestUpdates extends Component{
    state={
        loading:true
    }

    componentDidMount(){
        if (this.props.latestUpdates===null){
            this.props.onGetLatestUpdates(LIMIT_FOR_LATEST_UPDATES).then(async ()=>{
                this.setState({loading:false})
            })
        }else{
            this.setState({loading:false})
        }
    }
    render(){
        const {loading} = this.state;
        const updates = this.props.latestUpdates;
        return(
            <Container header='Latest Updates' className='fullLatestUpdates'>
                {!loading && updates.map(update=>(
                    <div key={update.Date}>
                        <h4 className='latestUpdates_date_header'>
                            {new Date(update.Date).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}
                        </h4>
                        {
                            update.Fandom.map(fandom=>
                                <span  key={fandom.FandomName} className='fullLatestUpdates_fandom_box'>
                                    <h4>{fandom.FandomName}</h4>
                                        <div className='fullLatestUpdates_fanfics_box'>
                                        {
                                            fandom.FanficsIds.map(fanfic=>(
                                                <p>
                                                    <span className={`color_${fanfic.Source}`}>{fanfic.Source}</span>
                                                    {`- ${fanfic.FanficID} - ${fanfic.Author} - ${fanfic.FanficTitle} - ${fanfic.Status} - ${fanfic.StatusDetails}`}
                                                </p>
                                            ))
                                        }
                                        </div>
                                </span>
                            )
                        }
                    </div>
                ))}  
            </Container>
        )
    }
};

const mapStateToProps = state =>{
    return{
        latestUpdates:       state.updates.latestUpdates
    };   
  }

const mapDispatchedToProps = dispatch =>{
    return{
        onGetLatestUpdates:         (limit)                         =>  dispatch(actions.getLatestUpdates(limit))
    }
}
export default connect(mapStateToProps,mapDispatchedToProps)(FullLatestUpdates);