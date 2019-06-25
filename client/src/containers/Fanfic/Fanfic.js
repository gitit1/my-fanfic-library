import React,{Component} from 'react';
import {connect} from 'react-redux';
import Pagination from 'rc-pagination';

import classes from './Fanfic.module.css';
import './Pagination.css';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
import Spinner from '../../components/UI/Spinner/Spinner';

import ShowFanficData from './ShowFanficData/ShowFanficData';
import Filters from './Filters/Filters';

class Fanfic extends Component{
    state={
        fanfics:[],
        userFanfics:[],
        pageNumber:1,
        pageLimit:20,
        fanficsCount:0,
        filters: {
            favorite:false,
            deleted:false
        }
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
        
        (fandoms.length===0) &&  await onGetFandoms()
        await onGetFanfics(fandomName,pageNumber,pageLimit,userEmail).then(async ()=>{
            let fanficsCount = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0].FanficsInFandom;
            let userFanfics  = this.props.userFanfics
            let fanfics      = this.props.fanfics
            // this.setState({pageTotal:Math.ceil(fanficsCount/pageLimit)})
            this.setState({fanficsCount,userFanfics,fanfics})
        })

        return null
    }

    paginationClickHandler = async (page) =>{
        console.log('page:',page)
        console.log('pageNumber:',this.state.pageNumber)
        
        await this.setState({pageNumber: page},await this.getFanfics)       
        return null
    }
    //UPDATE USERDATA:
    FavoriteHandler = async(fanficId,favorite) =>{
        let isFav = await this.props.onMarkFavorite(this.props.userEmail,this.props.match.params.FandomName,fanficId,!favorite)
        const userFanficsCopy = [...this.state.userFanfics];
        let objIndex = userFanficsCopy.findIndex((fanfic => fanfic.FanficID == fanficId));
        console.log(objIndex)
        if(objIndex!==-1){
            userFanficsCopy[objIndex].Favorite = !favorite;
        }else{
            userFanficsCopy.push({

                SavedType:[],
                ReadingList:[],
                FanficID:fanficId,
                Favorite:!favorite
            })
        }
        this.setState({
            userFanfics: userFanficsCopy
        })


    }
    FinishedHandler = async(fanficId,finished) =>{
        // await this.props.onMarkFinished(this.props.userEmail,this.props.match.params.FandomName,fanficId,!favorite)
        const userFanficsCopy = [...this.state.userFanfics];
        let objIndex = userFanficsCopy.findIndex((fanfic => fanfic.FanficID == fanficId));
        console.log(objIndex)
        if(objIndex!==-1){
            userFanficsCopy[objIndex].ChapterStatus = 'Finished';
        }else{
            userFanficsCopy.push({
                SavedType:[],
                ReadingList:[],
                FanficID:fanficId,
                // Favorite:!favorite
            })
        }
        this.setState({
            userFanfics: userFanficsCopy
        })


    }

    //FILTERS:
    ActiveFiltersHandler = async(event)=>{
        event.preventDefault();
        
        const {onGetFilteredFanfics} = this.props, {filters} = this.state;
        let filterArr = []
        console.log('filters',filters);
        for(let key in filters){
            filters[key] === true && filterArr.push(key)
        }
        console.log(filterArr)
        
        await onGetFilteredFanfics(this.props.match.params.FandomName,this.props.userEmail,filterArr).then(async filteredFanfics=>{
                let fanficsCount = filteredFanfics.length;
                this.setState({
                    fanfics:filteredFanfics,
                    fanficsCount:fanficsCount})
        });
    }
    FilterHandler = async(filter)=>{
        const {filters} = this.state;

        switch (filter) {
            case 'Favorite':
                console.log('Favorite')
                this.setState({filters: {...filters,'favorite': !filters['favorite']}});
                break;
            case 'Deleted':
                console.log('Deleted')
                this.setState({filters: {...filters,'deleted': !filters['deleted']}});
                break;
            default:
                console.log('hellooo')
                break;
        }
    }

    render(){
        // TODO: FIX LOADING TO BE LIKE A03 
        let {pageNumber,fanficsCount,pageLimit} = this.state     
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
                    <Filters        filter={this.FilterHandler}
                                    filtersAction={this.ActiveFiltersHandler}/>
                    <ShowFanficData fanfics={this.state.fanfics}
                                    userFanfics={this.state.userFanfics}
                                    markAsFavorite={this.FavoriteHandler}            
                                    markAsFinished={this.FinishedHandler}            
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
        userEmail:      state.auth.user.email
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        onGetFandoms:           ()                                          =>  dispatch(actions.getFandomsFromDB()),
        onGetFanfics:           (FandomName,pageNumber,pageLimit,userEmail) =>  dispatch(actions.getFanficsFromDB(FandomName,pageNumber,pageLimit,userEmail)),
        onMarkFavorite:         (userEmail,fandomName,fanficId,favorite)    =>  dispatch(actions.addFanficToUserFavorites(userEmail,fandomName,fanficId,favorite)),
        onMarkFinished:         (userEmail,fandomName,fanficId,favorite)    =>  dispatch(actions.addFanficToUserFavorites(userEmail,fandomName,fanficId,favorite)),
        onGetFilteredFanfics:   (fandomName,userEmail,filters)              =>  dispatch(actions.getFilteredFanficsFromDB(fandomName,userEmail,filters))
    }
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Fanfic);