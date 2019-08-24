import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';

import Grid from '@material-ui/core/Grid';

import Spinner from '../../components/UI/Spinner/Spinner';
import Container from '../../components/UI/Container/Container';
import IndexContainer from './components/IndexContainer/IndexContainer';
import IndexFandoms from './components/Sections/Fandoms/Fandoms'
import LatestUpdates from './components/Sections/LatestUpdates/LatestUpdates'
import MyFanfics from './components/Sections/MyFanfics/MyFanfics'
import MyLatestActivity from './components/Sections/MyLatestActivity/MyLatestActivity'

import './Index.scss';


class Index extends Component{
    state={
        latestUpdates:[],
        loading:true
    }
    componentWillMount(){
        const {fandoms} = this.props;
        //LatestUpdates
        // const fandomsNames = fandoms.map(fandom=> {return fandom.FandomName});
        this.props.onGetLatestUpdates().then(()=>{
            this.setState({loading:false})
        })
    }
    render(){
        const {loading} = this.state;
        const {fandoms,screenSize,smallSize,latestUpdates} = this.props;
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
        fandoms:        state.fandoms.fandoms,
        loading:        state.fandoms.loading,
        screenSize:     state.screenSize.size,
        smallSize:      state.screenSize.smallSize,
        latestUpdates:  state.updates.latestUpdates,
        loadingUpdate:  state.updates.loading,
    };   
}   

const mapDispatchedToProps = dispatch =>{
    return{
        onGetLatestUpdates:    (fandoms)   =>  dispatch(actions.getLatestUpdates(fandoms))
    }
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Index);

//TODO: NEED TO BE FROM SERVER