import React,{Component} from 'react';
import {connect} from 'react-redux';
import Pagination from 'rc-pagination';

import classes from './Fanfic.module.css';
import './Pagination.css';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
// import Spinner from '../../components/UI/Spinner/Spinner';

import ShowFanficData from './ShowFanficData/ShowFanficData';
import Filters from './Filters/Filters';

class Fanfic extends Component{
    state={
        fanfics:[],
        userFanfics:[],
        pageNumber:1,
        pageLimit:5,
        fanficsCount:0,
        filters: {
            favorite:false,
            deleted:false,
            complete:false
        },
        filterArr: []
    }


    componentWillMount(){     
        this.getFanfics()
    }

    getFanfics = async () =>{
        console.log('[Fanfic.js] getFanfics()')
        const {pageNumber,pageLimit} = this.state
        const {fandoms,onGetFandoms,onGetFanfics,counter} = this.props
        console.log('counter:',counter)
        const fandomName = this.props.match.params.FandomName;
        const userEmail = this.props.userEmail ? this.props.userEmail : null;
        
        (fandoms.length===0) &&  await onGetFandoms()
        await onGetFanfics(fandomName,pageNumber,pageLimit,userEmail).then(()=>{
            let fanficsCount = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0].FanficsInFandom;
            let userFanfics  = this.props.userFanfics
            let fanfics      = this.props.fanfics
            // this.setState({pageTotal:Math.ceil(fanficsCount/pageLimit)})
            this.setState({fanficsCount,userFanfics,fanfics})
        })

        return null
    }

    paginationClickHandler = async (page) =>{
        const {filterArr} = this.state;
        console.log('page: ',page)
        await this.setState({pageNumber: page}, async () => {
            (filterArr.length===0) ? await this.getFanfics() : await this.ActiveFiltersHandler()
        })       
        return null
    }
    //UPDATE USERDATA:
    FavoriteHandler = async(fanficId,favorite) =>{
        await this.props.onMarkFavorite(this.props.userEmail,this.props.match.params.FandomName,fanficId,!favorite)
        const userFanficsCopy = [...this.state.userFanfics];
        let objIndex = userFanficsCopy.findIndex((fanfic => fanfic.FanficID === fanficId));
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
        let objIndex = userFanficsCopy.findIndex((fanfic => fanfic.FanficID === fanficId));
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
        console.log('[]Fanfic.js] ActiveFiltersHandler()');
        event && event.preventDefault();
        const {onGetFilteredFanfics} = this.props, {filters,pageLimit} = this.state;
        let {filterArr,pageNumber} = this.state;
        event ? pageNumber=1 : pageNumber=pageNumber
        filterArr = [];
        
        // if(filterArr.length===0){ for(let key in filters){filters[key] === true && filterArr.push(key)} }
        for(let key in filters){filters[key] === true && filterArr.push(key)}
        // this.setState({filterArr: {...filterArr,[filter]: !filterArr[filter]}})    
        
        await onGetFilteredFanfics(this.props.match.params.FandomName,this.props.userEmail,filterArr,pageLimit,pageNumber).then(()=>{
            const fanfics = [...this.props.fanfics],fanficsCount = this.props.counter, userFanfics  = this.props.userFanfics;
            this.setState({fanfics,fanficsCount,userFanfics,filterArr,pageNumber})
        });
        return null
    }

    FilterHandler = async(filter)=>{
        const {filters,filterArr} = this.state;
        this.setState({filters: {...filters,[filter]: !filters[filter]}})                
    }
    cancelFiltersHandler = async() =>{
        const {filters} = this.state;
        for(let key in filters){filters[key] === true && this.setState({filters:{[key]: false}})}
        this.setState({filterArr:[],pageNumber:1},await this.getFanfics)
        

    }

    render(){
        // TODO: FIX LOADING TO BE LIKE A03 
        let {fanfics,userFanfics,pageNumber,fanficsCount,pageLimit,filters} = this.state;
        
        return(
            <Container header={this.props.match.params.FandomName}>
                    <div className={'Pagination'}>
                    {/* <p>{(pageNumber*pageLimit)-pageLimit+1}-{pageLimit*pageNumber} of {fanficsCount} Works</p> */}
                    <Pagination onChange={this.paginationClickHandler} 
                                current={pageNumber} 
                                total={fanficsCount}
                                className={classes.Pagination}
                                defaultPageSize={pageLimit}
                                showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} Works`}
                    />
                    </div>
                    <Filters        filter={this.FilterHandler}
                                    cancelFilters={this.cancelFiltersHandler}
                                    filtersAction={this.ActiveFiltersHandler}
                                    checked={filters}/>
                    {/* {this.props.loading ? <Spinner/> : ( */}
                        <ShowFanficData fanfics={fanfics}
                                        userFanfics={userFanfics}
                                        markAsFavorite={this.FavoriteHandler}            
                                        markAsFinished={this.FinishedHandler}            
                        />
                    {/* )} */}
                    {
                        // this.props.fanfics.map(fanfic=>(
                        //     <p>{fanfic.fileName}</p>
                        // )
                    }
            </Container>
        )
    }
}

const mapStateToProps = state =>{
    return{
        fandoms:        state.fandoms.fandoms,
        fanfics:        state.fanfics.fanfics,
        userFanfics:    state.fanfics.userFanfics,
        counter:        state.fanfics.counter,
        message:        state.fanfics.message,
        loading:        state.fanfics.loading,
        userEmail:      state.auth.user.email
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        onGetFandoms:           ()                                                      =>  dispatch(actions.getFandomsFromDB()),
        onGetFanfics:           (fandomName,pageNumber,pageLimit,userEmail)             =>  dispatch(actions.getFanficsFromDB(fandomName,pageNumber,pageLimit,userEmail)),
        onMarkFavorite:         (userEmail,fandomName,fanficId,favorite)                =>  dispatch(actions.addFanficToUserFavorites(userEmail,fandomName,fanficId,favorite)),
        onMarkFinished:         (userEmail,fandomName,fanficId,favorite)                =>  dispatch(actions.addFanficToUserFavorites(userEmail,fandomName,fanficId,favorite)),
        onGetFilteredFanfics:   (fandomName,userEmail,filters,pageLimit,pageNumber)     =>  dispatch(actions.getFilteredFanficsFromDB(fandomName,userEmail,filters,pageLimit,pageNumber))
    }
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Fanfic);