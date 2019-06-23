import React,{Component} from 'react';
import {connect} from 'react-redux';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

import classes from './Fanfic.module.css';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
import Spinner from '../../components/UI/Spinner/Spinner';

import ShowFanficData from './ShowFanficData/ShowFanficData';

class Fanfic extends Component{
    state={
        fanfics:[],
        pageNumber:1,
        pageLimit:20,
        pageTotal: 0,
        fanficsCount:0
    }


    componentWillMount(){     
        this.getFanfics()
    }

    getFanfics = async () =>{
        console.log('getFanfics: ')
        const {pageNumber,pageLimit} = this.state
        console.log('pageNumber: ',pageNumber)
        const {fandoms,onGetFandoms,onGetFanfics} = this.props
        const fandomName = this.props.match.params.FandomName;
        
        (fandoms.length===0) &&  await onGetFandoms();
        await onGetFanfics(fandomName,pageNumber,pageLimit).then(async ()=>{
            let fanficsCount = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0].FanficsInFandom;
            // this.setState({pageTotal:Math.ceil(fanficsCount/pageLimit)})
            this.setState({fanficsCount})
        });

        return null
    }

    pageClickHandler = async (page) =>{
        console.log('page:',page)
        console.log('pageNumber:',this.state.pageNumber)
        
        await this.setState({pageNumber: page},await this.getFanfics)       
        return null
    }

    render(){
        let {pageNumber,fanficsCount,pageLimit} = this.state;        
        return(
            <Container header={this.props.match.params.FandomName}>
                <Pagination onChange={this.pageClickHandler} 
                            current={pageNumber} 
                            total={fanficsCount}
                            className={classes.Pagination}
                            defaultPageSize={pageLimit}
                />
                {this.props.loading ?
                    <Spinner/>      :
                    <ShowFanficData fanfics={this.props.fanfics}
                                    markAsFavorite={this.props.FavoriteHandler}            
                                    />
                }
            </Container>
        )
    }
}

const mapStateToProps = state =>{
    return{
        fandoms:    state.fandoms.fandoms,
        fanfics:    state.fanfics.fanfics,
        message:    state.fanfics.message,
        loading:    state.fanfics.loading
    };   
  }
  
const mapDispatchedToProps = dispatch =>{
    return{
        onGetFandoms:    () => dispatch(actions.getFandomsFromDB()),
        onGetFanfics:    (FandomName,pageNumber,pageLimit) => dispatch(actions.getFanficsFromDB(FandomName,pageNumber,pageLimit))
    };
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Fanfic);