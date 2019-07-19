import React,{Component} from 'react';
import {connect} from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import Container from '../../components/UI/Container/Container'
import IndexContainer from './IndexContainer/IndexContainer';
import IndexFandoms from './Sections/Fandoms/Fandoms'
import LatestUpdates from './Sections/LatestUpdates/LatestUpdates'
import MyFanfics from './Sections/MyFanfics/MyFanfics'
import MyLatestActivity from './Sections/MyLatestActivity/MyLatestActivity'



class Index extends Component{

    render(){

        return(
            <Container>
                {/* TODO: NEED TO BE FROM SERVER */}
                { this.props.loading ? <Spinner/> :
                    <React.Fragment>
                        <IndexContainer header='Fandoms'><IndexFandoms fandoms={this.props.fandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName))}/></IndexContainer>
                        <IndexContainer header='Latest Updates'><LatestUpdates /></IndexContainer>
                        <IndexContainer header='My Fanfics Updates'><MyFanfics /></IndexContainer>
                        <IndexContainer header='My Latest Activities'><MyLatestActivity /></IndexContainer>
                    </React.Fragment>
                }
            </Container>
        )
    }
}

const mapStateToProps = state =>{
    return{
        fandoms:    state.fandoms.fandoms,
        loading:    state.fandoms.loading
    };   
  }   


export default connect(mapStateToProps)(Index);
