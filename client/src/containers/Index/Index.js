import React,{Component} from 'react';
import {connect} from 'react-redux';

import Grid from '@material-ui/core/Grid';

import Spinner from '../../components/UI/Spinner/Spinner';
import Container from '../../components/UI/Container/Container';
import IndexContainer from './components/IndexContainer/IndexContainer';
import IndexFandoms from './components/Sections/Fandoms/Fandoms'
import LatestUpdates from './components/Sections/LatestUpdates/LatestUpdates'
import MyFanfics from './components/Sections/MyFanfics/MyFanfics'
import MyLatestActivity from './components/Sections/MyLatestActivity/MyLatestActivity'



class Index extends Component{

    render(){

        return(
            <Container>
                { this.props.loading ? <Spinner/> :
                    <Grid container  spacing={4}>
                        <IndexContainer header='Fandoms'>
                            <IndexFandoms fandoms={this.props.fandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName))}/>
                        </IndexContainer>
                        <IndexContainer header='Latest Updates'><LatestUpdates /></IndexContainer>
                        <IndexContainer header='My Fanfics Updates'><MyFanfics /></IndexContainer>
                        <IndexContainer header='My Latest Activities'><MyLatestActivity /></IndexContainer>
                    </Grid>
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

//TODO: NEED TO BE FROM SERVER