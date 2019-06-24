import React,{Component} from 'react';
import {connect} from 'react-redux';
import Pagination from 'rc-pagination';

import classes from './Fanfic.module.css';
import './Pagination.css';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
import Spinner from '../../components/UI/Spinner/Spinner';

import ShowFanficData from './ShowFanficData/ShowFanficData';

class Fanfic extends Component{
    state={
        fanfics:[],
        userFanfics:[],
        pageNumber:1,
        pageLimit:20,
        pageTotal: 0,
        fanficsCount:0,
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
        const userEmail = this.props.userEmail ? this.props.userEmail : null;
        
        (fandoms.length===0) &&  await onGetFandoms();
        //TODO: change onGetFanfics to take useremail as well and return 2 arrays: [][] (https://stackoverflow.com/questions/5760058/how-to-return-multiple-arrays-from-a-function-in-javascript)
        await onGetFanfics(fandomName,pageNumber,pageLimit,userEmail).then(async ()=>{
            let fanficsCount = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0].FanficsInFandom;
            let userFanfics  = this.props.userFanfics
            // this.setState({pageTotal:Math.ceil(fanficsCount/pageLimit)})
            this.setState({fanficsCount,userFanfics})
        })

        return null
    }

    paginationClickHandler = async (page) =>{
        console.log('page:',page)
        console.log('pageNumber:',this.state.pageNumber)
        
        await this.setState({pageNumber: page},await this.getFanfics)       
        return null
    }

    FavoriteHandler = async(fanficId,favorite) =>{
        const isFavorite = await this.props.onMarkFavorite(this.props.userEmail,fanficId,!favorite)
        console.log('isFavorite:::',isFavorite)
        const userFanficsCopy = [...this.state.userFanfics];
        let objIndex = userFanficsCopy.findIndex((fanfic => fanfic.FanficID == fanficId));
        userFanficsCopy[objIndex].Favorite = !favorite;
        this.setState({
            userFanfics: userFanficsCopy
        })
    }

    render(){
        // TODO: FIX LOADING TO BE LIKE A03 
        let {pageNumber,fanficsCount,pageLimit} = this.state;        
        return(
            <Container header={this.props.match.params.FandomName}>
                    <div className={'Pagination'}>
                    <p>{(pageNumber*pageLimit)-pageLimit+1}-{pageLimit*pageNumber} of {fanficsCount} Works</p>
                    <Pagination onChange={this.paginationClickHandler} 
                                current={pageNumber} 
                                total={fanficsCount}
                                className={classes.Pagination}
                                defaultPageSize={pageLimit}
                    />
                    </div>
                    <ShowFanficData fanfics={this.props.fanfics}
                                    userFanfics={this.state.userFanfics}
                                    markAsFavorite={this.FavoriteHandler}            
                    />
            </Container>
        )
    }
}

const mapStateToProps = state =>{
    return{
        fandoms:        state.fandoms.fandoms,
        fanfics:        state.fanfics.fanfics,
        userFanfics:    state.fanfics.userFanfics,
        message:        state.fanfics.message,
        loading:        state.fanfics.loading,
        userEmail:     state.auth.user.email
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        onGetFandoms:           () => dispatch(actions.getFandomsFromDB()),
        onGetFanfics:           (FandomName,pageNumber,pageLimit,userEmail) => dispatch(actions.getFanficsFromDB(FandomName,pageNumber,pageLimit,userEmail)),
        // onGetFanficData:        (fanfics,userEmail) => dispatch(actions.getUserDataFromDB(fanfics,userEmail)),
        onMarkFavorite:         (userEmail,fanficId,favorite) => dispatch(actions.addFanficToUserFavorites(userEmail,fanficId,favorite))
    }
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Fanfic);