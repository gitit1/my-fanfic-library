import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
// import Spinner from '../../components/UI/Spinner/Spinner';

import Filters from './Filters/Filters';
import {filtersArrayInit} from './Filters/FiltersArray'

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

import ShowFanficData from './ShowFanficData/ShowFanficData';
import Pagination from './components/Pagination/Pagination';
import FanficsNumbers from './components/FanficsNumbers/FanficsNumbers';
import {fanficsNumbersList} from './components/FanficsNumbers/assets/fanficsNumbersList';
import {fanficsNumbersFunc} from './components/FanficsNumbers/components/fanficsNumbersFunc';

import './Fanfic.scss'


class Fanfic extends Component{    
    state={
        fanfics:[],
        userFanfics:[],
        filters: filtersArrayInit,
        filterArr: [],
        pageNumber:1,
        pageLimit:10,
        currentSort:'dateLastUpdate',
        drawerFilters: false,
        fanficsNumbers:fanficsNumbersList,
        inputChapterFlag:null,
        readingListAncor:null,
        showTags: (this.props.size==='s') ? false : true,
        showData: false
    }

    componentWillMount(){this.getFanfics()}

    getFanfics = async () =>{
        const {pageNumber,pageLimit} = this.state
        const {fandoms,onGetFandoms,onGetFanfics} = this.props
        const fandomName = this.props.match.params.FandomName;
        const userEmail = this.props.userEmail ? this.props.userEmail : null;
        
        (fandoms.length===0) &&  await onGetFandoms()
        await onGetFanfics(fandomName,pageNumber,pageLimit,userEmail).then(()=>{
            const {fanfics,userFanfics,ignoredCount}  = this.props
            let fandom = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0];
            const fanficsNumbers = fanficsNumbersFunc(fandom,ignoredCount);

            this.setState({userFanfics,fanfics,fanficsNumbers:fanficsNumbers,showData:true});
            console.log(this.state.fanficsNumbers)
        })

        return null
    }

    paginationClickHandler = async (page) =>{
        const {filterArr} = this.state;
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
                        FanficID:fanficId,
                        [markType]:!mark
                    })
                }
                this.setState({
                    userFanfics: userFanficsCopy
                })
                break;
            case 'Follow':
                if(objIndex!==-1){
                    userFanficsCopy[objIndex].Follow = !mark;
                }else{
                    userFanficsCopy.push({
                        SavedType:[],
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
                        FanficID:fanficId,
                        [markType]:!mark
                    })
                }
                const {onGetFilteredFanfics,userEmail} = this.props, {pageLimit,fanficsNumbers,filterArr,pageNumber} = this.state;
                let fanficsIgnoredCount = (!mark===true) ? fanficsNumbers.fanficsIgnoredCount+1 : fanficsNumbers.fanficsIgnoredCount-1;
                if(markType==='Ignore'){                   
                     await onGetFilteredFanfics(this.props.match.params.FandomName,userEmail,filterArr,pageLimit,pageNumber).then(()=>{
                         const fanfics = [...this.props.fanfics],
                         fanficsCount = this.props.counter
                         let newPagesCounter = Math.ceil(fanficsCount/pageLimit);
                         newPagesCounter = (pageNumber>newPagesCounter) ? newPagesCounter : pageNumber
                         this.setState({
                            fanfics,
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
            default:
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
                console.log('status:',status)
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
            default:
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
                if (statusType==='In Progress'){
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
        pageNumber= event ? 1 : pageNumber
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

    filterHandler = async(filter,event,type)=>{
        const {filters} = this.state;
        switch (type) {
            case 'sort':
                this.setState({currentSort:event.target.value,filters: {...filters,[event.target.value]: !filters[filter]}}) 
                break;
            case 'filter':
                if(event){
                    this.setState({filters: {...filters,[filter]: event.target.value}})  
                }else{
                    let filterInit = (typeof filters[filter]==='string') ? '' : !filters[filter];
                    this.setState({filters: {...filters,[filter]: filterInit}})  
                }
                break;
            default:
                break;
        }
    }
    cancelFiltersHandler = async() =>{this.setState({filters:filtersArrayInit,filterArr:[],pageNumber:1,currentSort:'dateLastUpdate'},await this.getFanfics)}

    toggleDrawer = (open) => event => {if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {return}this.setState({drawerFilters: open})}

    openReadingListBox=(event)=>{this.setState({readingListAncor:event.currentTarget})                }

    closeReadingListBox= (el) => {this.setState({readingListAncor:el})}   

    showTagsToggle=()=> {this.setState({showTags:!this.state.showTags})}

    render(){
        // TODO: FIX LOADING TO BE LIKE A03 
        let {fanfics,userFanfics,pageNumber,fanficsNumbers,pageLimit,filters,inputChapterFlag,currentSort,readingListAncor} = this.state;
        return(
            <Container header={this.props.match.params.FandomName} className='fanfics'>
                <Grid container className='containerGrid'>
                    <Pagination gridClass='paginationGrid' onChange={this.paginationClickHandler} showTotal={true} current={pageNumber} 
                                total={fanficsNumbers.fanficsCurrentCount} paginationClass={'pagination'} pageLimit={pageLimit} />

                    <Grid container className='containerGrid'>
                        <FanficsNumbers fanficsNumbers={fanficsNumbers} fandomName={this.props.match.params.FandomName.toLocaleString(undefined, {maximumFractionDigits:2})}/>
                        <Grid className={'buttons'} item xs={3}>
                            <Button onClick={this.toggleDrawer(true)}>Filters</Button>
                            <Drawer anchor="right" open={this.state.drawerFilters} onClose={this.toggleDrawer(false)}>
                                <div className='filterDrewer' role="presentation">
                                    <Button onClick={this.toggleDrawer(false)}>Close</Button>
                                    <Filters filter={this.filterHandler}
                                                sort={currentSort}
                                                cancelFilters={this.cancelFiltersHandler}
                                                filtersAction={this.activeFiltersHandler}
                                                checked={filters}
                                                />
                                </div>
                            </Drawer>
                        </Grid>
                        
                    </Grid>
                    
                    <Grid className={'main'}>
                    <Divider/>
                        {fanficsNumbers.fanficsCurrentCount===0 ? 
                                <p><b>Didn't found any fanfics with this search filters</b></p>
                            :
                                <ShowFanficData fanfics={fanfics}
                                                userFanfics={userFanfics}
                                                markAs={this.markAsHandler}            
                                                markStatus={this.statusHandler}
                                                inputChapterToggle={this.inputChapterHandler}
                                                inputChapter={inputChapterFlag}
                                                readingListAncor={readingListAncor}
                                                openReadingListBox={this.openReadingListBox}
                                                closeReadingListBox={()=>this.closeReadingListBox(null)}
                                                size={this.props.size}
                                                showTags={this.state.showTags}
                                                showTagsToggle={this.showTagsToggle}
                                />
                            }
                    </Grid>
                </Grid>
                <Pagination gridClass='paginationGrid paginationGridButtom'  onChange={this.paginationClickHandler} showTotal={false} current={pageNumber} 
                            total={fanficsNumbers.fanficsCurrentCount} paginationClass={'pagination'} pageLimit={pageLimit} />
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
        userEmail:      state.auth.user.email,
        size:           state.screenSize.size
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