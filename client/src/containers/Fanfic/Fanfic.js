import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
// import Spinner from '../../components/UI/Spinner/Spinner';

import Filters from './Filters/Filters';
import {filtersArrayInit} from './Filters/assets/FiltersArray'


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
        userFanfics:[],
        filters: filtersArrayInit,
        filterArr: [],
        pageNumber:1,
        pageLimit:10,
        currentSort:'dateLastUpdate',
        currentSource:'all',        
        fanficsNumbers:fanficsNumbersList,
        inputChapterFlag:null,
        inputCategoryFlag:null,
        showData: false,
        drawerFilters: false,
        showSelectCategory:false,
        categoriesArr:[],
        categoriesShowTemp:[],
        fandomName:this.props.match.params.FandomName,
        newReadingLists:{
            newLists:[],
            value:null
        }
    }

    componentWillMount(){this.getFanfics()}

    getFanfics = async () =>{
        const {pageNumber,pageLimit,fandomName} = this.state
        const {fandoms,onGetFandoms,onGetFanfics} = this.props
        const userEmail = this.props.userEmail ? this.props.userEmail : null;
        
        (fandoms.length===0) &&  await onGetFandoms()
        await onGetFanfics(fandomName,pageNumber,pageLimit,userEmail).then(()=>{
            const {userFanfics,ignoredCount}  = this.props
            let fandom = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0];
            const fanficsNumbers = fanficsNumbersFunc(fandom,ignoredCount);

            this.setState({userFanfics,fanficsNumbers:fanficsNumbers,showData:true});
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

    markAsHandler = async(fanficId,author,fanficTitle,source,markType,mark) =>{
        console.log('!mark,,,',!mark)
        const {fandomName} = this.state;
        await this.props.onMarkHandler(this.props.userEmail,fandomName,fanficId,author,fanficTitle,source,markType,!mark)
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
                const {onGetFilteredFanfics,userEmail} = this.props, {pageLimit,fanficsNumbers,filterArr,pageNumber,fandomName} = this.state;
                let fanficsIgnoredCount = (!mark===true) ? fanficsNumbers.fanficsIgnoredCount+1 : fanficsNumbers.fanficsIgnoredCount-1;
                if(markType==='Ignore'){                   
                     await onGetFilteredFanfics(fandomName,userEmail,filterArr,pageLimit,pageNumber).then(()=>{
                         const fanficsCount = this.props.counter
                         let newPagesCounter = Math.ceil(fanficsCount/pageLimit);
                         newPagesCounter = (pageNumber>newPagesCounter) ? newPagesCounter : pageNumber
                         this.setState({
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
    statusHandler = async(fanficId,author,fanficTitle,source,statusType,status,event) =>{
        let newStatus='',newStatusFalse='',flag=false,chapterNum;
        console.log('status::',status)
        console.log('statusType::',statusType)
        switch (statusType) {
            case 'Finished':
                console.log('status:',status)
                newStatus = (status!==null && status==='Finished') ? 'Need to Read' : 'Finished'
                // newStatusFalse = (newStatus==='Finished') ? 'Need to Read' : 'Finished'
                await this.props.onStatusHandler(this.props.userEmail,this.state.fandomName,fanficId,author,fanficTitle,source,statusType,newStatus)
                flag = true;
                break;
            case 'In Progress':
                if(event.key === 'Enter') {
                    chapterNum = event.target.value;
                    newStatus = 'In Progress';
                    await this.props.onStatusHandler(this.props.userEmail,this.state.fandomName,fanficId,author,fanficTitle,source,statusType,newStatus,chapterNum);
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
        const {onGetFilteredFanfics} = this.props, {filters,pageLimit,fandomName} = this.state;
        let {filterArr,pageNumber,fanficsNumbers} = this.state;
        pageNumber= event ? 1 : pageNumber
        filterArr = [];
        
        // if(filterArr.length===0){ for(let key in filters){filters[key] === true && filterArr.push(key)} }
        for(let key in filters){ 
            filters[key] === true && filterArr.push(key)
            if(typeof filters[key] !== 'boolean' && filters[key] !=='' && filters[key].length>0){filterArr.push(`${key}_${filters[key]}`)}
        }
        console.log('filterArr:',filterArr)
        // this.setState({filterArr: {...filterArr,[filter]: !filterArr[filter]}})    
        
        await onGetFilteredFanfics(fandomName,this.props.userEmail,filterArr,pageLimit,pageNumber).then(()=>{
            const fanficsCount = this.props.counter, userFanfics  = this.props.userFanfics;

            this.setState({userFanfics,filterArr,pageNumber,
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
            case 'source':
                this.setState({currentSource:event.target.value,filters: {...filters,[event.target.value]: !filters[filter]}}) 
                break;
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

    showSelectCategoryHandler=(id)=>{
        console.log('this.state.inputCategoryFlag:',this.state.inputCategoryFlag)
        let showCat = (this.state.inputCategoryFlag===null) ? true : false;
        this.setState({showSelectCategory:showCat,inputCategoryFlag:(this.state.inputCategoryFlag===null) ? Number(id) : null  })
    }

    getCategories = (categoriesArr) =>{this.setState({categoriesArr:categoriesArr})}

    getFiltersCategories = (categoriesArr) =>{this.setState({filters: {...this.state.filters,categories:categoriesArr}})}

    saveCategories = (fandomName,fanficId) =>{
        this.props.onSaveCategories(fandomName,fanficId,this.state.categoriesArr).then(()=>{
            const categoriesTemp = [...this.state.categoriesShowTemp];
            let objIndex = categoriesTemp.findIndex((fanfic => fanfic.FanficID === fanficId));
            if(objIndex!==-1){
                categoriesTemp[objIndex].Categories = this.state.categoriesArr;
            }else{
                categoriesTemp.push({
                    FanficID:fanficId,
                    Categories:this.state.categoriesArr
                })
            }
            this.setState({
                categoriesShowTemp: categoriesTemp,
                categoriesArr:[],
                showSelectCategory:false,
                inputCategoryFlag:null
            })
        })
    }

    addToReadingList = (fanfic,rlValue) =>{
        const {FanficID,Author,FanficTitle,Source} = fanfic;
        const {userEmail} = this.props;
        const {fandomName,newReadingLists} = this.state;
        const userFanficsCopy = [...this.state.userFanfics];
        const val = rlValue!==null ? rlValue : newReadingLists.value;
        this.props.onSaveNewReadingList(userEmail,fandomName,FanficID,Author,FanficTitle,Source,val).then(res=>{
            console.log('here!!',res)
            let objIndex = userFanficsCopy.findIndex((fic => fic.FanficID === fanfic.FanficID));
            if(objIndex!==-1){
                console.log('userFanficsCopy[objIndex]:',userFanficsCopy[objIndex].ReadingList)
                if(userFanficsCopy[objIndex].ReadingList){
                    userFanficsCopy[objIndex].ReadingList.push(val);
                }else{
                    userFanficsCopy[objIndex] = {...userFanficsCopy[objIndex],ReadingList:[val]}
                }
            }else{
                userFanficsCopy.push({FanficID:FanficID,ReadingList:[val]})
            }
            if(!rlValue){
                let newLists = (newReadingLists.newLists===null) ? [val] :  [...newReadingLists.newLists,val];
                this.setState({userFanfics: userFanficsCopy,newReadingLists:{...this.state.newReadingLists,value:null,newLists}})
            }else{
                this.setState({userFanfics: userFanficsCopy,newReadingLists:{...this.state.newReadingLists,value:null}})
            }
        })
    }

    setReadingList = (event,fanfic) =>{
        const value = event.target.value;
        if(event.key === 'Enter') {
            this.setState({newReadingLists:{
                ...this.state.newReadingLists,value
            }},()=>{
                this.addToReadingList(fanfic,null)
            });
        }else{
            this.setState({newReadingLists:{
                ...this.state.newReadingLists,
                value
            }})
        }
    }

    render(){
        const {fandomName,userFanfics,pageNumber,fanficsNumbers,pageLimit,filters,inputChapterFlag,currentSort,drawerFilters,
               currentSource,showSelectCategory,inputCategoryFlag,categoriesShowTemp,newReadingLists} = this.state;
        const {isManager,size,isAuthenticated,fanfics,readingLists} = this.props;


        const props             =   {   isManager,size,isAuthenticated};
        const categoriesProps   =   {   inputCategoryFlag,categoriesShowTemp,showSelectCategory,categoriesTemp:categoriesShowTemp,
                                        getCategories:this.getCategories,saveCategories:this.saveCategories,showCategory:this.showSelectCategoryHandler}
        const filtersProps      =   {   drawer:drawerFilters,checked:filters,filterHandler:this.filterHandler,
                                        toggleDrawer:this.toggleDrawer,cancel:this.cancelFiltersHandler,activeFilter:this.activeFiltersHandler}
        const readingListProps  =   {   readingLists,newReadingLists,setReadingList:this.setReadingList,addToReadingList:this.addToReadingList}
        return(
            <Container header={fandomName} className='fanfics'>
                <Grid container className='containerGrid'>
                    <Pagination gridClass='paginationGrid' onChange={this.paginationClickHandler} showTotal={true} current={pageNumber} 
                                total={fanficsNumbers.fanficsCurrentCount} paginationClass={'pagination'} pageLimit={pageLimit} />

                    <Grid container className='containerGrid'>
                        <FanficsNumbers fanficsNumbers={fanficsNumbers} fandomName={fandomName}/>
                        <Filters sort={currentSort} source={currentSource} filters={filtersProps} getCategories={this.getFiltersCategories}/>                        
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
                                                props={props}                                
                                                categories={categoriesProps}
                                                readingLists={readingListProps}
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
        fandoms:            state.fandoms.fandoms,
        fanfics:            state.fanfics.fanfics,
        userFanfics:        state.fanfics.userFanfics,
        counter:            state.fanfics.counter,
        message:            state.fanfics.message,
        loading:            state.fanfics.loading,
        ignoredCount:       state.fanfics.ignoredCount,
        readingLists:       state.fanfics.readingLists,
        userEmail:          state.auth.user.email,
        isAuthenticated:    state.auth.isAuthenticated,
        isManager:          state.auth.isManager,
        size:               state.screenSize.size
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        onGetFandoms:           ()                                                                                  =>  dispatch(actions.getFandomsFromDB()),
        onGetFanfics:           (fandomName,pageNumber,pageLimit,userEmail)                                         =>  dispatch(actions.getFanficsFromDB(fandomName,pageNumber,pageLimit,userEmail)),
        onMarkHandler:          (userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark)             =>  dispatch(actions.addFanficToUserMarks(userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark)),
        onStatusHandler:        (userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data)    =>  dispatch(actions.addFanficToUserStatus(userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data)),
        onGetFilteredFanfics:   (fandomName,userEmail,filters,pageLimit,pageNumber)                                 =>  dispatch(actions.getFilteredFanficsFromDB(fandomName,userEmail,filters,pageLimit,pageNumber)),
        onSaveCategories:       (fandomName,fanficId,categoriesArray)                                               =>  dispatch(actions.saveCategories(fandomName,fanficId,categoriesArray)),
        onSaveNewReadingList:   (userEmail,fandomName,fanficId,author,fanficTitle,source,name)                      =>  dispatch(actions.saveNewReadingList(userEmail,fandomName,fanficId,author,fanficTitle,source,name))
    
    }
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Fanfic);
