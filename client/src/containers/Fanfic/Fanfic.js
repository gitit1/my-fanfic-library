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
import {filtersArrayInit} from './Filters/FiltersArray'

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';


class Fanfic extends Component{    
    state={
        fanfics:[],
        userFanfics:[],
        pageNumber:1,
        pageLimit:10,
        filters: filtersArrayInit,
        currentSort:'dateLastUpdate',
        filterArr: [],
        inputChapterFlag:null,
        drawerFilters: false,
        fanficsNumbers:{
            fanficsTotalCount:0,
            fanficsCurrentCount:0,
            fanficsDeletedCount:0,
            fanficsIgnoredCount:0,
            ao3FanficsCount:0,
            ffFanficsCount:0,
            patreonFanficsCount:0,
            tumblrFanficsCount:0,
            wattpadFanficsCount:0,   
        }
    }

    componentWillMount(){     
        this.getFanfics()
    }

    getFanfics = async () =>{
        console.log('[Fanfic.js] getFanfics()')
        const {pageNumber,pageLimit,fanficsNumbers} = this.state
        const {fandoms,onGetFandoms,onGetFanfics,counter} = this.props
        console.log('counter:',counter)
        const fandomName = this.props.match.params.FandomName;
        const userEmail = this.props.userEmail ? this.props.userEmail : null;
        
        (fandoms.length===0) &&  await onGetFandoms()
        await onGetFanfics(fandomName,pageNumber,pageLimit,userEmail).then(()=>{
            let fandom = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0];
            let fanficsTotalCount = fandom.FanficsInFandom
            let fanficsDeletedCount = (fandom.DeletedFanfics) ? fandom.DeletedFanfics : 0//"Bacup" fanfics
            let fanficsIgnoredCount = (this.props.ignoredCount) ? this.props.ignoredCount : 0
            // TODO: check for duplicates in DeletedFanfics and ignoredCount
            let ao3FanficsCount = fanficsTotalCount - fanficsDeletedCount;
            let fanficsCurrentCount = fanficsTotalCount - fanficsIgnoredCount;
            let userFanfics  = this.props.userFanfics
            let fanfics      = this.props.fanfics
            // this.setState({pageTotal:Math.ceil(fanficsCount/pageLimit)})
            this.setState({userFanfics,fanfics,
                           fanficsNumbers:{
                               ...fanficsNumbers,
                               fanficsTotalCount,
                               fanficsCurrentCount,
                               fanficsDeletedCount,
                               fanficsIgnoredCount,
                               ao3FanficsCount,
                               // TODO: need to change the way of saving in server - add counter to each source                            
                           }
            })
        })

        return null
    }

    paginationClickHandler = async (page) =>{
        const {filterArr} = this.state;
        console.log('page: ',page)
        await this.setState({pageNumber: page}, async () => {
            (filterArr.length===0) ? await this.getFanfics() : await this.activeFiltersHandler()
        })       
        return null
    }
    //UPDATE USERDATA:
    markAsHandler = async(fanficId,markType,mark) =>{
        console.log('!mark,,,',!mark)
        await this.props.onMarkHandler(this.props.userEmail,this.props.match.params.FandomName,fanficId,markType,!mark)
        const userFanficsCopy = [...this.state.userFanfics];

        let objIndex = userFanficsCopy.findIndex((fanfic => fanfic.FanficID === fanficId));      
        switch (markType) {
            case 'Favorite':
                if(objIndex!==-1){
                    userFanficsCopy[objIndex].Favorite = !mark;
                }else{
                    userFanficsCopy.push({
                        SavedType:[],
                        ReadingList:[],
                        FanficID:fanficId,
                        [markType]:!mark
                    })
                }
                this.setState({
                    userFanfics: userFanficsCopy
                })
                break;
            case 'Ignore':               
                if(objIndex!==-1){
                    userFanficsCopy[objIndex].Ignore = !mark;          
                }else{
                    userFanficsCopy.push({
                        SavedType:[],
                        ReadingList:[],
                        FanficID:fanficId,
                        [markType]:!mark
                    })
                }
                const {onGetFilteredFanfics,userEmail} = this.props, {pageLimit,fanficsNumbers,filterArr,pageNumber} = this.state;
                let fanficsIgnoredCount = (!mark===true) ? fanficsNumbers.fanficsIgnoredCount+1 : fanficsNumbers.fanficsIgnoredCount-1;
                if(markType==='Ignore'){                   
                     await onGetFilteredFanfics(this.props.match.params.FandomName,userEmail,filterArr,pageLimit,pageNumber).then(()=>{
                         const fanfics = [...this.props.fanfics],
                         fanficsCount = this.props.counter, userFanfics  = this.props.userFanfics;
                         let newPagesCounter = Math.ceil(fanficsCount/pageLimit);
                         newPagesCounter = (pageNumber>newPagesCounter) ? newPagesCounter : pageNumber
                         this.setState({fanfics,userFanfics,
                            fanficsNumbers:{
                                ...fanficsNumbers,
                                fanficsCurrentCount:fanficsCount,
                                fanficsIgnoredCount
                            },   
                            pageNumber:newPagesCounter,
                            userFanfics: userFanficsCopy,
                            filterArr      
                        })
                        this.paginationClickHandler(newPagesCounter)
                     });
                }else{
                    this.setState({
                        userFanfics: userFanficsCopy
                    })
                }
                break;               
        }  
    }
    //Need to Read, Finished, In Progress
    statusHandler = async(fanficId,statusType,status,event) =>{
        let newStatus='',newStatusFalse='',flag=false,chapterNum;
        console.log('status::',status)
        console.log('statusType::',statusType)
        switch (statusType) {
            case 'Finished':
                newStatus = (status!==null && status==='Finished') ? 'Need to Read' : 'Finished'
                // newStatusFalse = (newStatus==='Finished') ? 'Need to Read' : 'Finished'
                await this.props.onStatusHandler(this.props.userEmail,this.props.match.params.FandomName,fanficId,statusType,newStatus)
                flag = true;
                break;
            case 'In Progress':
                if(event.key === 'Enter') {
                    chapterNum = event.target.value;
                    newStatus = 'In Progress';
                    await this.props.onStatusHandler(this.props.userEmail,this.props.match.params.FandomName,fanficId,statusType,newStatus,chapterNum);
                    flag = true;
                }
                break;
            case 'Need to Read':
                // newStatusFalse = (statusType==='Finished') && 'Finished'
                break;
        }
        if(flag){
            newStatusFalse = (newStatus==='In progress') ? 'Need to Read' : 'In progress'
            console.log('newStatusFalse:::',newStatusFalse)
            const userFanficsCopy = [...this.state.userFanfics];
            let objIndex = userFanficsCopy.findIndex((fanfic => fanfic.FanficID === fanficId));
            console.log('objIndex:',objIndex)
            if(objIndex!==-1){
                userFanficsCopy[objIndex].Status = newStatus;
                if (statusType=='In Progress'){
                    userFanficsCopy[objIndex].ChapterStatus = Number(chapterNum)
                }
            }else{
                userFanficsCopy.push({
                    SavedType:[],
                    ReadingList:[],
                    FanficID:fanficId,
                    Status:newStatus,
                    ChapterStatus: (this.state.inputChapterFlag) ? Number(chapterNum) : null  
                })
            }
            this.setState({
                userFanfics: userFanficsCopy,
                inputChapterFlag:null
            })
        }

    }
    inputChapterHandler = (id) =>{
        if(id===this.state.inputChapterFlag){
            this.setState({inputChapterFlag:null})
        }else{
            this.setState({inputChapterFlag:id})
        }
    }

    //FILTERS:
    activeFiltersHandler = async(event)=>{
        console.log('[Fanfic.js] activeFiltersHandler()');
        event && event.preventDefault();
        const {onGetFilteredFanfics} = this.props, {filters,pageLimit} = this.state;
        let {filterArr,pageNumber,fanficsNumbers} = this.state;
        event ? pageNumber=1 : pageNumber=pageNumber
        filterArr = [];
        
        // if(filterArr.length===0){ for(let key in filters){filters[key] === true && filterArr.push(key)} }
        for(let key in filters){ 
            filters[key] === true && filterArr.push(key)
            if(typeof filters[key] !== 'boolean' && filters[key] !==''){filterArr.push(`${key}_${filters[key]}`)}
        }
        console.log('filterArr:',filterArr)
        // this.setState({filterArr: {...filterArr,[filter]: !filterArr[filter]}})    
        
        await onGetFilteredFanfics(this.props.match.params.FandomName,this.props.userEmail,filterArr,pageLimit,pageNumber).then(()=>{
            const fanfics = [...this.props.fanfics],fanficsCount = this.props.counter, userFanfics  = this.props.userFanfics;

            this.setState({fanfics,userFanfics,filterArr,pageNumber,
                           drawerFilters:false,
                           fanficsNumbers:{
                               ...fanficsNumbers,
                               fanficsCurrentCount:fanficsCount
                           }
            
            })
        });
        return null
    }

    FilterHandler = async(filter,event,type)=>{
        const {filters} = this.state;
        console.log('FilterHandler()')
        switch (type) {
            case 'sort':
                 console.log('sort')
                this.setState({
                    currentSort:event.target.value,
                    filters: {...filters,
                              [event.target.value]: !filters[filter]}
                }) 
                console.log('sort-state',this.state.currentSort)
                break;
            case 'filter':
                console.log('filter')
                if(event){
                    this.setState({filters: {...filters,[filter]: event.target.value}})  
                }else{
                    let filterInit = (typeof filters[filter]==='string') ? '' : !filters[filter];
                    this.setState({filters: {...filters,[filter]: filterInit}})  
                }
        }
        // if(event.target.value){
        //     this.setState({filters: {...filters,[filter]: event.target.value}})                
        // }else{
        //     let filterInit = (typeof filters[filter]==='string') ? '' : !filters[filter];
        //     this.setState({filters: {...filters,[filter]: filterInit}})    
        // }
    }
    cancelFiltersHandler = async() =>{
        const {filters} = this.state;
        this.setState({filters:filtersArrayInit,filterArr:[],pageNumber:1,currentSort:'dateLastUpdate'},await this.getFanfics)
        // this.setState({filters:filtersArrayInit,filterArr:[],pageNumber:1,drawerFilters:false},await this.getFanfics)
    }

    toggleDrawer = (open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        this.setState({drawerFilters: open});
    }

    render(){
        // TODO: FIX LOADING TO BE LIKE A03 
        let {fanfics,userFanfics,pageNumber,fanficsNumbers,pageLimit,filters,inputChapterFlag,currentSort} = this.state;

        return(
            <Container header={this.props.match.params.FandomName}>
                    <div className={'Pagination'}>
                    {/* TODO: switch button "gallery mode" - add/edit/delete image , fixed Image () in user settings*/}
                    {/* TODO: switch limit (5.10,20,30)*/}
                    {/* TODO: drewer for filters*/}
                    {/* TODO: error checker for filters*/}
                    {/* TODO: add routing to page (pagination)- if not exist - redirect to first page*/}
                    {/* TODO: pagination movining from middle if the pages are smaller then 8 */}
                    {/* TODO: animation for ignore delete */}
                    {/* TODO: if fanfic not complete - cant mark as finished*/}
                    {/* TODO: if fanfic in progress limit it to the chapters the fanfic does have*/}
                    {/* TODO: Add filter: hiatus fanfic*/}
                    <Pagination onChange={this.paginationClickHandler} 
                                current={pageNumber} 
                                total={fanficsNumbers.fanficsCurrentCount}
                                className={classes.Pagination}
                                defaultPageSize={pageLimit}
                                showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} Works`}
                    />
                    <div>
                    {/* <div className={FanficsNumbers}> */}
                        <p>There is a total of <b>{fanficsNumbers.fanficsTotalCount}</b> fanfics in <b>{this.props.match.params.FandomName}</b> Fandom</p>
                        <p>Sources: <b style={{color:'#8A0407'}}>AO3:</b> <b>{fanficsNumbers.ao3FanficsCount}</b> , <b style={{color:'#0a48ab'}}>Backup (Deleted from sites):</b> <b>{fanficsNumbers.fanficsDeletedCount}</b> </p>
                        <p><b>{fanficsNumbers.fanficsIgnoredCount}</b> of the fanfics are ignored (filter by ignore to see them and reactive them)</p>
                    </div>
                    </div>

                    <Button onClick={this.toggleDrawer(true)}>Filters</Button>
                    <Drawer anchor="right" open={this.state.drawerFilters} onClose={this.toggleDrawer(false)}>
                        <div className={classes.FilterDrewer} role="presentation">
                            <Button onClick={this.toggleDrawer(false)}>Close</Button>
                            <Filters    filter={this.FilterHandler}
                                        sort={currentSort}
                                        cancelFilters={this.cancelFiltersHandler}
                                        filtersAction={this.activeFiltersHandler}
                                        checked={filters}/>
                        </div>
                    </Drawer>

                    {/* {this.props.loading ? <Spinner/> : ( */}
                        {fanficsNumbers.fanficsCurrentCount===0 ? 
                            <p><b>Didn't found any fanfics with this search filters</b></p>
                        :
                            <ShowFanficData fanfics={fanfics}
                                            userFanfics={userFanfics}
                                            markAs={this.markAsHandler}            
                                            markStatus={this.statusHandler}
                                            inputChapterToggle={this.inputChapterHandler}
                                            inputChapter={inputChapterFlag} 
                            />
                        }
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
        ignoredCount:   state.fanfics.ignoredCount,
        userEmail:      state.auth.user.email
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        onGetFandoms:           ()                                                          =>  dispatch(actions.getFandomsFromDB()),
        onGetFanfics:           (fandomName,pageNumber,pageLimit,userEmail)                 =>  dispatch(actions.getFanficsFromDB(fandomName,pageNumber,pageLimit,userEmail)),
        onMarkHandler:          (userEmail,fandomName,fanficId,markType,mark)               =>  dispatch(actions.addFanficToUserMarks(userEmail,fandomName,fanficId,markType,mark)),
        onStatusHandler:        (userEmail,fandomName,fanficId,statusType,status,data)      =>  dispatch(actions.addFanficToUserStatus(userEmail,fandomName,fanficId,statusType,status,data)),
        onGetFilteredFanfics:   (fandomName,userEmail,filters,pageLimit,pageNumber)         =>  dispatch(actions.getFilteredFanficsFromDB(fandomName,userEmail,filters,pageLimit,pageNumber))
    }
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Fanfic);