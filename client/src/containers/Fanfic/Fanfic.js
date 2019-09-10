import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
import Spinner from '../../components/UI/Spinner/Spinner';

import Filters from './Filters/Filters';
import {filtersArrayInit,filtersArrayAttr} from './Filters/assets/FiltersArray'


import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

import ShowFanficData from './ShowFanficData/ShowFanficData';
import Pagination from './components/Pagination/Pagination';
import FanficsNumbers from './components/FanficsNumbers/FanficsNumbers';
import {fanficsNumbersList} from './components/FanficsNumbers/assets/fanficsNumbersList';
import {fanficsNumbersFunc} from './components/FanficsNumbers/components/fanficsNumbersFunc';
import { withRouter } from 'react-router-dom';

import './Fanfic.scss'


class Fanfic extends Component{    
    state={
        userFanfics:[],
        filters: filtersArrayAttr,
        filterArr: [],
        pageNumber:1,
        pageLimit:10,       
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
            value:''
        },
        urlQueries:{
            isFiltered:false,
            page:1,
            filterQuery: ''
        },
        firstLoad:true,
        dataLoad:false
    }

    componentWillMount(){
        console.log('componentWillMount')
        const {location} = this.props;
        let {urlQueries,filterArr} = this.state;

        let isFiltered = location.search.includes('filters=true') ? true : false;
        let isInPage = location.search.includes('page=') ? true : false;

        const page = isInPage ? Number(location.search.split('page=')[1].split('&')[0]) : 1;
        if(isFiltered){
            console.log('will mount page',page)
            let filterQuery = location.search.split('filters=true&')[1];
            filterArr = this.props.location.search.split('filters=true')[1].split('&'); 
            isInPage && this.setState({pageNumber:page})
            this.setState({filterArr,urlQueries:{...urlQueries,isFiltered,page,filterQuery}},async ()=>{ 
                await this.getFanfics()               
                await this.activeFiltersHandler(false);
                this.setState({firstLoad:false})
            });
        }else{
            isInPage && this.setState({pageNumber:page,urlQueries:{...urlQueries,page}})
            this.getFanfics().then(()=>{
                this.setState({firstLoad:false})
            })
        }
        
        
    }

    getFanfics = async () =>{
        const {pageNumber,pageLimit,fandomName} = this.state
        const {fandoms,onGetFandoms,onGetFanfics} = this.props
        const userEmail = this.props.userEmail ? this.props.userEmail : null;
        
        (fandoms.length===0) &&  await onGetFandoms()
        await onGetFanfics(fandomName,pageNumber,pageLimit,userEmail).then(()=>{
            const {fandoms,userFanfics,ignoredCount}  = this.props
            let fandom = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0];
            const fanficsNumbers = fanficsNumbersFunc(fandom,ignoredCount);

            this.setState({userFanfics,fanficsNumbers:fanficsNumbers,showData:true});
        })

        return null
    }

    addUrlQueries = () =>{
        const {urlQueries,pageNumber} = this.state;
        let str = '';
        str = (!urlQueries.isFiltered) ? `?page=${pageNumber}` : `?page=${pageNumber}&filters=true&${urlQueries.filterQuery}`;
        
        if((urlQueries.isFiltered)||(urlQueries.page!==pageNumber||pageNumber===1)){
            this.props.history.push(str);
            this.setState({urlQueries:{...urlQueries,page:pageNumber}});
        }else{
            this.props.history.replace(this.props.location)
        }

    }

    paginationClickHandler = async (page) =>{
        const {filterArr} = this.state;
        await this.setState({pageNumber: page,dataLoad:true}, async () => {
            (filterArr.length===0) ? await this.getFanfics() : await this.activeFiltersHandler();
            await this.addUrlQueries();
            this.setState({dataLoad:false})
        })       
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return null
    }

    markAsHandler = async(fanficId,author,fanficTitle,source,markType,mark) =>{
        console.log('!mark,,,',!mark)
        const {onMarkHandler,onGetFilteredFanfics,onDeleteFanfic,userEmail} = this.props, {pageLimit,fanficsNumbers,filterArr,pageNumber,fandomName} = this.state;
        (markType!=='Delete') && await onMarkHandler(userEmail,fandomName,fanficId,author,fanficTitle,source,markType,!mark);
        const userFanficsCopy = [...this.state.userFanfics];

        let objIndex = (markType!=='Delete') && userFanficsCopy.findIndex((fanfic => fanfic.FanficID === fanficId));      
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
            case 'Delete':     
                console.log('DELETE!!!')          
                const {} = this.props;
                await onDeleteFanfic(fandomName,fanficId,source,mark).then(async ()=>{
                    console.log('here...')
                    // await onGetFilteredFanfics(fandomName,userEmail,filterArr,pageLimit,pageNumber).then(()=>{
                        let fanficsDeletedCount = (fanficsNumbers.fanficsDeletedCount-1<=0) ? 0 : fanficsNumbers.fanficsDeletedCount-1; 
                        console.log('here... 1')
                        const fanficsCount = (this.props.counter === 0) ? fanficsNumbers.fanficsTotalCount : this.props.counter;
                        let newPagesCounter = Math.ceil(fanficsCount-1/pageLimit);
                        newPagesCounter = (pageNumber>newPagesCounter) ? newPagesCounter : pageNumber;
                        // TODO: FIX IT 
                        // let sourceCounter = (source==='AO3') ? fanficsNumbers.ao3FanficsCount-1 : (source==='FF') ? fanficsNumbers.ffFanficsCount-1 : ;
                        // let sourceNumber = (source==='AO3') ? 'ao3FanficsCount' : 'ffFanficsCount'
                        this.setState({
                        fanficsNumbers:{
                            ...fanficsNumbers,
                            fanficsTotalCount:fanficsNumbers.fanficsTotalCount-1,
                            fanficsCurrentCount:fanficsCount,
                            fanficsDeletedCount
                        },   
                        pageNumber:newPagesCounter,
                        filterArr      
                    })
                    this.paginationClickHandler(newPagesCounter)
                    // });               
                })           
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
    getbackfilters = (filters,filterArr) =>{
        let tempFilters = filters;
        const sort = ['dateLastUpdate','publishDate','authorSort','titleSort','hits','kudos','bookmarks','comments']
        const source = ['all','ao3','ff','backup']

        for(let key in filterArr){ 
            let value = filterArr[key].replace(/%20/g,' ').replace(/%27/g,"'");
            console.log('Key:',filterArr[key].replace(/%20/g,' ').replace(/%27/g,"'"))
              if(sort.includes(value)){
                tempFilters['currentSort'] = value;
              }else if(source.includes(value)){
                tempFilters['currentSource'] = value;
              }else if(value.includes('categories_')){
                tempFilters['categories'] = value.split('categories_')[1].split(',');
              }else if(value.includes('_')){
                tempFilters[value.split('_')[0]] = value.split('_')[1];
              }else{
                tempFilters[value]=true
              }
        }
        return tempFilters;
    }
    activeFiltersHandler = async(event)=>{
        console.log('[Fanfic.js] activeFiltersHandler()');
        event && event.preventDefault();       
        // console.log('event:',event)
        
        let isFiltered = this.props.location.search.includes('filters=true') ? true : false;
        const {onGetFilteredFanfics} = this.props, {pageLimit,fandomName,urlQueries} = this.state;
        let {pageNumber,fanficsNumbers} = this.state,tempFilters =[];       

        let filterArr = [];
        let filters =  this.state.filters;
        pageNumber = event ? 1 : pageNumber;
        if(isFiltered && !event){
            filterArr = this.props.location.search.split('filters=true')[1].replace(/%20/g,' ').replace(/%27/g,"'").split('&').filter(Boolean);
            let tempFilters = await this.getbackfilters(filters,filterArr)   
            this.setState({filters: tempFilters})  
        }else{
            for(let key in filters){ 
                filters[key] === true && filterArr.push(key)
                if( typeof filters[key] !== 'boolean' && filters[key] !=='' && filters[key].length>0
                     && key !=='currentSort'  && key !=='currentSource' ){
                    filterArr.push(`${key}_${filters[key]}`)
                }
            }
            filterArr.filter(Boolean)
            console.log('filterArr:',filterArr)
            this.setState({urlQueries:{...urlQueries,filterQuery:filterArr.join('&'),isFiltered:true}})
        }
        await onGetFilteredFanfics(fandomName,this.props.userEmail,filterArr,pageLimit,pageNumber).then(()=>{
            
            const fanficsCount = this.props.counter, userFanfics  = this.props.userFanfics;

            this.setState({userFanfics,filterArr,pageNumber,
                           drawerFilters:false,
                           fanficsNumbers:{
                               ...fanficsNumbers,
                               fanficsCurrentCount:fanficsCount
                           }
            
            })
            this.addUrlQueries()
        });
        return null
    }

    filterTagsHandler = async (filter,event,type,tagType) =>{
        const {filters} = this.state;
        await this.cancelFiltersHandler()
        this.setState({filters: {...filters,['tags']: `${tagType}_${filter}`}},()=>{
            this.activeFiltersHandler(false)
        })  
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
    cancelFiltersHandler = async() =>{
        this.setState({filters:filtersArrayInit,filterArr:[],pageNumber:1,drawerFilters:false,
                       urlQueries:{...this.state.urlQueries,isFiltered:false,filterQuery:''}},await this.getFanfics)
        this.addUrlQueries()
    }

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
        this.props.onSaveReadingList(userEmail,fandomName,FanficID,Author,FanficTitle,Source,val).then(res=>{
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
                this.setState({userFanfics: userFanficsCopy,newReadingLists:{...this.state.newReadingLists,value:'',newLists}})
            }else{
                this.setState({userFanfics: userFanficsCopy,newReadingLists:{...this.state.newReadingLists,value:''}})
            }
        })
    }

    setReadingList = (event,fanfic) =>{
        const oldValue = this.state.newReadingLists.value,{newReadingLists} = this.state;
        let value='';
        console.log('back:',event.key)
        if(event.key === 'Enter') {
            this.addToReadingList(fanfic,null)
        }else if(event.key === 'Backspace'){
            value = oldValue.substring(0, oldValue.length - 1);
            this.setState({newReadingLists:{...newReadingLists,value}})
        }else if((event.which <= 90 && event.which >= 48) || (event.which <= 111 && event.which >= 107) || (event.which <= 222 && event.which >= 180) || event.which===32){
            value= oldValue+event.key;
            this.setState({newReadingLists:{...newReadingLists,value}})
        }
    }

    render(){
        const {fandomName,userFanfics,pageNumber,fanficsNumbers,pageLimit,filters,inputChapterFlag,drawerFilters,
               showSelectCategory,inputCategoryFlag,categoriesShowTemp,newReadingLists,firstLoad,dataLoad} = this.state;
        const {isManager,size,isAuthenticated,fanfics,readingLists,loading} = this.props;

        const props             =   {   isManager,size,isAuthenticated};
        const categoriesProps   =   {   inputCategoryFlag,categoriesShowTemp,showSelectCategory,categoriesTemp:categoriesShowTemp,
                                        getCategories:this.getCategories,saveCategories:this.saveCategories,showCategory:this.showSelectCategoryHandler}
        const filtersProps      =   {   drawer:drawerFilters,checked:filters,filterHandler:this.filterHandler,
                                        toggleDrawer:this.toggleDrawer,cancel:this.cancelFiltersHandler,activeFilter:this.activeFiltersHandler}
        const readingListProps  =   {   readingLists:(readingLists===null) ? [] : readingLists,newReadingLists,setReadingList:this.setReadingList,addToReadingList:this.addToReadingList}
        
        return(
            <Container header={fandomName} className='fanfics'>
                {firstLoad 
                    ?<Spinner />
                    :<React.Fragment>
                        <Grid container className='containerGrid'>
                            <Pagination gridClass='paginationGrid' onChange={this.paginationClickHandler} showTotal={true} current={pageNumber} 
                                        total={fanficsNumbers.fanficsCurrentCount} paginationClass={'pagination'} pageLimit={pageLimit} />

                            <Grid container className='containerGrid'>
                                <FanficsNumbers fanficsNumbers={fanficsNumbers} fandomName={fandomName}/>
                                <Filters filters={filtersProps} getCategories={this.getFiltersCategories}/>                        
                            </Grid>
                            
                            <Grid className={'main'}>
                                <Divider/>
                                {fanficsNumbers.fanficsCurrentCount===0 ? 
                                    <p><b>Didn't found any fanfics with this search filters</b></p>
                                    : dataLoad ? <Spinner /> : 
                                        <ShowFanficData fanfics={fanfics}
                                                            userFanfics={userFanfics}
                                                            markAs={this.markAsHandler}            
                                                            markStatus={this.statusHandler}
                                                            inputChapterToggle={this.inputChapterHandler}
                                                            inputChapter={inputChapterFlag}
                                                            props={props}                                
                                                            categories={categoriesProps}
                                                            readingLists={readingListProps}
                                                            filter={this.filterTagsHandler}
                                        />
                                        
                                    }
                            </Grid>
                        </Grid>
                        {!dataLoad && 
                            <Pagination gridClass='paginationGrid paginationGridButtom'  onChange={this.paginationClickHandler} showTotal={false} current={pageNumber} 
                                    total={fanficsNumbers.fanficsCurrentCount} paginationClass={'pagination'} pageLimit={pageLimit} />
                        }
                    </React.Fragment>
                }
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
        readingLists:       state.fanfics.readingListsNames,
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
        onDeleteFanfic:         (fandomName,fanficId,source,complete)                                               =>  dispatch(actions.deleteFanficFromDB(fandomName,fanficId,source,complete)),
        onGetFilteredFanfics:   (fandomName,userEmail,filters,pageLimit,pageNumber)                                 =>  dispatch(actions.getFilteredFanficsFromDB(fandomName,userEmail,filters,pageLimit,pageNumber)),
        onSaveCategories:       (fandomName,fanficId,categoriesArray)                                               =>  dispatch(actions.saveCategories(fandomName,fanficId,categoriesArray)),
        onSaveReadingList:      (userEmail,fandomName,fanficId,author,fanficTitle,source,name)                      =>  dispatch(actions.saveReadingList(userEmail,fandomName,fanficId,author,fanficTitle,source,name))
    
    }
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(Fanfic));
