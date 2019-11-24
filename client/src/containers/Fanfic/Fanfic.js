import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
import Spinner from '../../components/UI/Spinner/Spinner';

import SwitchesPanel from './components/SwitchesPanel/SwitchesPanel'
import Filters from './components/Filters/Filters';
import {filtersArrayInit,filtersArrayAttr} from './components/Filters/assets/FiltersArray'

import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

import ShowFanficData from './components/ShowFanficData/ShowFanficData';
import GalleryView from './components/GalleryView/GalleryView';
import Pagination from './components/Pagination/Pagination';
import FanficsNumbers from './components/FanficsNumbers/FanficsNumbers';
import {fanficsNumbersFunc} from './components/FanficsNumbers/components/fanficsNumbersFunc';
import { withRouter } from 'react-router-dom';

import EditFanfic from './components/EditFanfic/EditFanfic'

import './Fanfic.scss'
import {state} from './assets/state'
import {Helmet} from "react-helmet";

class Fanfic extends Component{    
    state=state;

    componentWillMount(){
        const {onGetReadingList,location,readingListsFull,userEmail} = this.props;
        let {urlQueries,filterArr,switches} = this.state;

        let isFiltered = location.search.includes('filters=true') ? true : false;
        let isInPage = location.search.includes('page=') ? true : false;

        if(switches[0].checked){
            this.setState({pageLimit:16})
        }
        const page = isInPage ? Number(location.search.split('page=')[1].split('&')[0]) : 1;
        readingListsFull.length===0 && onGetReadingList(userEmail)

        if(isFiltered){
            if(location.search.includes('noUserData')){
                switches = [...switches];
                switches[3].checked = false;
                this.setState({switches})
            }

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

    componentWillUnmount(){
        this.props.onGetReadingList(this.props.userEmail)
    }

    getFanfics = async () =>{
        const {pageNumber,pageLimit} = this.state;
        const {fandoms,onGetFandoms,onGetFanfics,location} = this.props;
        const userEmail = this.props.userEmail ? this.props.userEmail : null;
        const fandomName = this.props.match.params.FandomName;
        
        let list = (location.search.split('list=')[1]!==undefined &&location.search.split('list=')[1].includes('true')) ? true : false;

        (fandoms.length===0 && !list) &&  await onGetFandoms()
        await onGetFanfics(fandomName,pageNumber,pageLimit,userEmail,list).then(()=>{
            const {fandoms,userFanfics,ignoredCount}  = this.props
            let fandom = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0];
            const fanficsNumbers = !list ? fanficsNumbersFunc(fandom,ignoredCount,list) : fanficsNumbersFunc(this.props.readingListsFull,null,list,fandomName);

            this.setState({fandomName,userFanfics,fanficsNumbers:fanficsNumbers,showData:true});
        })
        list && this.setState({rlMode:true})
        return null
    }

    addUrlQueries = () =>{
        const {location} = this.props;
        const {urlQueries,pageNumber,fandomName} = this.state;
        console.log('location:',location)
        let str = (location.search.split('list=')[1]!==undefined &&location.search.split('list=')[1].includes('true')) ? `${fandomName}?list=true` : '';
        str = str==='' ? '?' : `${str}&`;
        str = (!urlQueries.isFiltered) ? str+`page=${pageNumber}` : str+`page=${pageNumber}&filters=true&${urlQueries.filterQuery}`;
        
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

    markAsHandler = async(fanficId,author,fanficTitle,source,markType,mark,deleted) =>{
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
                await onDeleteFanfic(fandomName,fanficId,source,mark,deleted).then(async ()=>{
                    // await onGetFilteredFanfics(fandomName,userEmail,filterArr,pageLimit,pageNumber).then(()=>{
                        let fanficsDeletedCount = (fanficsNumbers.fanficsDeletedCount-1<=0) ? 0 : fanficsNumbers.fanficsDeletedCount-1; 
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
        
        setTimeout(this.activeFiltersHandler(), 4000);
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
        let {pageNumber,fanficsNumbers} = this.state;       

        let filterArr = [];
        let filters =  this.state.filters;
        console.log('filters:',this.state.filters)
        console.log('filterArr:',this.state.filterArr)
        pageNumber = event ? 1 : pageNumber;
        if(isFiltered && !event){
            console.log('this.props.location.search',this.props.location.search)
            filterArr = this.props.location.search.split('filters=true')[1].replace(/%20/g,' ').replace(/%27/g,"'").split('&').filter(Boolean);
            let tempFilters = await this.getbackfilters(filters,filterArr)   
            this.setState({filters: tempFilters}) 
            if(urlQueries.filterQuery.includes('noUserData') && !this.props.location.search.split('filters=true')[1].includes('noUserData')){
                filterArr.push('noUserData')
            }
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
        this.setState({filters: {...filters,'tags': `${tagType}_${filter}`}},()=>{
            this.activeFiltersHandler(false)
        })  
    }

    filterHandler = async(filter,event,type)=>{
        const {filters} = this.state;
        switch (type) {
            case 'source':
                this.setState({filters: {...filters,[event.target.value]: !filters[filter],currentSource:event.target.value}}) 
                break;
            case 'sort':
                this.setState({filters: {...filters,[event.target.value]: !filters[filter],currentSort:event.target.value}}) 
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
        const {fandomName,newReadingLists,rlMode} = this.state;
        let userFanficsCopy = [...this.state.userFanfics];
        const val = rlValue!==null ? rlValue : newReadingLists.value;

        if(!rlMode){//add to reading list
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
        }else{//remove from reading list
            console.log('val:',val)
            this.props.onDeleteFanficFromReadingList(userEmail,fandomName,FanficID,Author,FanficTitle,Source,val).then(res=>{
                let objIndex = userFanficsCopy.findIndex((fic => fic.FanficID === fanfic.FanficID));
                if(objIndex!==-1){
                    userFanficsCopy = userFanficsCopy[objIndex].ReadingList.filter(e => e !== val);
                    this.setState({userFanfics: userFanficsCopy,newReadingLists:{...this.state.newReadingLists,value:''}})
                }
            })
        }

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

    switchChangeHandler = (type) =>{
        console.log('type:',type)
        const {switches,urlQueries} = this.state;
        let objIndex = switches.findIndex((sw => sw.id === type));   
        const switchesCopy = [...switches];
        switchesCopy[objIndex].checked = !switchesCopy[objIndex].checked;
        this.setState({switches:switchesCopy});

        // if(switches[0].checked && type==='gallery'){
        //     this.setState({pageLimit:16},()=>this.activeFiltersHandler())
        // }else if(!switches[0].checked && type==='gallery'){
        //     this.setState({pageLimit:10},()=>this.activeFiltersHandler())
        // }

        if(!switches[3].checked && type==='noUserData'){//Don't show userdata  
            this.filterHandler('noUserData',null,'filter') 
            let isFiltered = this.props.location.search.includes('filters=true') ? true : false;
            if(isFiltered){
                let filterArr = [...this.state.filterArr,'noUserData'];
                let filterQuery = urlQueries.filterQuery + '&noUserData'
                this.setState({filterArr,urlQueries:{...urlQueries,filterQuery}},()=>(this.activeFiltersHandler()))
            }else{
                let filterQuery = '?filters=true&noUserData'
                this.setState({urlQueries:{...urlQueries,filterQuery}},()=>this.activeFiltersHandler())
            }               
        }else if(switches[3].checked && type==='noUserData'){
            this.cancelFiltersHandler()
        }
    
    }

    addImageToggle = (id) =>{
        if(id===this.state.addImageFlag){
            this.setState({addImageFlag:null})
        }else{
            this.setState({addImageFlag:id})
        }
    }

    editFanficToggle = (fanfic,flag)=>{
        this.setState({editFanfic:!this.state.editFanfic,editFanficData:fanfic})
        if(flag){
            this.activeFiltersHandler(false);
        }
    }

    render(){
        const {fandomName,userFanfics,pageNumber,fanficsNumbers,pageLimit,filters,inputChapterFlag,drawerFilters,addImageFlag,rlMode,
               showSelectCategory,inputCategoryFlag,categoriesShowTemp,newReadingLists,firstLoad,dataLoad,switches,editFanfic,editFanficData} = this.state;
        const {isManager,size,isAuthenticated,fanfics,readingLists} = this.props;

        const props             =   {   isManager,size,isAuthenticated};
        const imageProps        =   {   addImageFlag,addImageToggle:this.addImageToggle}
        const categoriesProps   =   {   inputCategoryFlag,categoriesShowTemp,showSelectCategory,categoriesTemp:categoriesShowTemp,
                                        getCategories:this.getCategories,saveCategories:this.saveCategories,showCategory:this.showSelectCategoryHandler}
        const filtersProps      =   {   drawer:drawerFilters,checked:filters,filterHandler:this.filterHandler,
                                        toggleDrawer:this.toggleDrawer,cancel:this.cancelFiltersHandler,activeFilter:this.activeFiltersHandler}
        const readingListProps  =   {   readingLists:(readingLists===null) ? [] : readingLists,newReadingLists,setReadingList:this.setReadingList,addToReadingList:this.addToReadingList}
        const switchesPanel     =   {   fandomName,switchChange:this.switchChangeHandler,switches,isManager}
        return(
            <Container header={fandomName} className='fanfics'>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{fandomName} Fanfics</title>
                    <description></description>
                    <meta name={`This page contains fanfics of ${fandomName}`} content={`${fandomName},fandom,lesbian,wlw,fanfic,fanfics,love,gay`}></meta>
                </Helmet>
                {firstLoad 
                    ?<Spinner />
                    : editFanfic ? 
                        <EditFanfic fanfic={editFanficData} fandomName={fandomName} back={this.editFanficToggle}/>
                    :   <React.Fragment>
                            <Grid container className='containerGrid'>
                                <Pagination gridClass='paginationGrid' onChange={this.paginationClickHandler} showTotal={true} current={pageNumber} 
                                            total={fanficsNumbers.fanficsCurrentCount} paginationClass={'pagination'} pageLimit={pageLimit} />
                                {!rlMode && 
                                    <Grid container className='containerGrid'>
                                        <FanficsNumbers fanficsNumbers={fanficsNumbers} fandomName={fandomName}/>
                                        <Filters filters={filtersProps} getCategories={this.getFiltersCategories}/>               
                                    </Grid>
                                }
                                {!rlMode && 
                                    <Grid className={'main'}>
                                        <Divider/>
                                        <SwitchesPanel switchesPanel={switchesPanel}/> 
                                    </Grid>
                                }
                                <Grid className={'main'}>
                                    <Divider/>
                                    {fanficsNumbers.fanficsCurrentCount===0 ? 
                                        <p><b>Didn't found any fanfics with this search filters</b></p>
                                        : dataLoad ? <Spinner /> : 
                                            !switches[0].checked ?
                                                <ShowFanficData     fanfics={fanfics}
                                                                    userFanfics={userFanfics}
                                                                    markAs={this.markAsHandler}            
                                                                    markStatus={this.statusHandler}
                                                                    editFanficToggle={this.editFanficToggle}
                                                                    inputChapterToggle={this.inputChapterHandler}
                                                                    inputChapter={inputChapterFlag}
                                                                    props={props}                                
                                                                    categories={categoriesProps}
                                                                    readingLists={readingListProps}
                                                                    filter={this.filterTagsHandler}
                                                                    switches={switches}
                                                                    images={imageProps}
                                                                    rlMode={rlMode}
                                                />
                                                :
                                                <GalleryView        fanfics={fanfics} 
                                                                    userFanfics={userFanfics}

                                                                    markAs={this.markAsHandler}            
                                                                    markStatus={this.statusHandler}
                                                                    inputChapterToggle={this.inputChapterHandler}
                                                                    inputChapter={inputChapterFlag}
                                                                    props={props}                                
                                                                    categories={categoriesProps}
                                                                    readingLists={readingListProps}
                                                                    filter={this.filterTagsHandler}
                                                                    switches={switches}
                                                                    images={imageProps}
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
        readingListsFull:   state.fanfics.readingListsFull,
        userEmail:          state.auth.user.email,
        isAuthenticated:    state.auth.isAuthenticated,
        isManager:          state.auth.isManager,
        size:               state.screenSize.size
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        onGetFandoms:           ()                                                                                  =>  dispatch(actions.getFandomsFromDB()),
        onGetReadingList:       (userEmail)                                                                         =>  dispatch(actions.getReadingList(userEmail)),
        onGetFanfics:           (fandomName,pageNumber,pageLimit,userEmail,list)                                    =>  dispatch(actions.getFanficsFromDB(fandomName,pageNumber,pageLimit,userEmail,list)),
        onMarkHandler:          (userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark)             =>  dispatch(actions.addFanficToUserMarks(userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark)),
        onStatusHandler:        (userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data)    =>  dispatch(actions.addFanficToUserStatus(userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data)),
        onDeleteFanfic:         (fandomName,fanficId,source,complete,deleted)                                       =>  dispatch(actions.deleteFanficFromDB(fandomName,fanficId,source,complete,deleted)),
        onGetFilteredFanfics:   (fandomName,userEmail,filters,pageLimit,pageNumber)                                 =>  dispatch(actions.getFilteredFanficsFromDB(fandomName,userEmail,filters,pageLimit,pageNumber)),
        onSaveCategories:       (fandomName,fanficId,categoriesArray)                                               =>  dispatch(actions.saveCategories(fandomName,fanficId,categoriesArray)),
        onSaveReadingList:      (userEmail,fandomName,fanficId,author,fanficTitle,source,name)                      =>  dispatch(actions.saveReadingList(userEmail,fandomName,fanficId,author,fanficTitle,source,name)),
        onDeleteFanficFromReadingList:      (userEmail,fandomName,fanficId,author,fanficTitle,source,name)          =>  dispatch(actions.deleteFanficFromReadingList(userEmail,fandomName,fanficId,author,fanficTitle,source,name))
    
    }
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(Fanfic));
