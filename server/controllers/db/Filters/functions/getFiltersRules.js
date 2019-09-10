
const {getIgnoredList} = require('../../helpers/getIgnoredList');

exports.getFiltersRules = async (filters,userEmail) =>{
    let filtersUserList=[],filtersFanficList=[],sortList=[],wordsFlag=false,searchWithIgnoreFlag=true,finishFlag=false,inProgressFlag=false;
    let tagsArr = ''; 
    console.log('filters:::',filters)
    await filters.map(filter=>{
        let filterKey = filter.split('_')[0]
        let filterValue = filter.split('_').pop()
        console.log('filterKey:',filterKey)
        // console.log('filterValue:',filterValue)
        switch (filterKey) {
            //User Data Filters:
            case 'follow':
                filtersUserList.push({'FanficList.Follow':true})
                break;
            case 'favorite':
                filtersUserList.push({'FanficList.Favorite':true})
                break;
            case 'finished':
                finishFlag=true;
                // filtersUserList.push({'FanficList.Status':'Finished'})
                break;
            case 'inProgress':
                inProgressFlag=true;
                (finishFlag)
                ? filtersUserList.push({$or: [{'FanficList.Status':'Finished'},{'FanficList.Status':'In Progress'}]})
                : filtersUserList.push({'FanficList.Status':'In Progress'});
                break;
            case 'ignore':
                searchWithIgnoreFlag = false;
                filtersUserList.push({'FanficList.Ignore':true})
                break; 
            //Fanfic Filters:  
            case 'complete':
                filtersFanficList.push({'Complete':true})
                break;
            case 'wip':
                filtersFanficList.push({'Complete':false})
                break;
            case 'oneShot':
                filtersFanficList.push({'Oneshot':true})
                break;
            case 'deleted':
                filtersFanficList.push({$or: [{'Deleted':true},{'Source':'Backup'}]})
                break;             
            //Sort Filters:
            case 'dateLastUpdate':
                sortList.push({'LastUpdateOfFic':-1})
                break;
            case 'publishDate':
                sortList.push({'PublishDate':-1})
                break;
            case 'authorSort':
                sortList.push({'Author':1})
                break;
            case 'titleSort':
                sortList.push({'FanficTitle':1})
                break;
            case 'hits':
                sortList.push({'Hits':-1})
                break; 
            case 'kudos':
                sortList.push({'Kudos':-1})
                break;
            case 'bookmarks':
                    sortList.push({'Bookmarks':-1})
                    break; 
            case 'comments':
                sortList.push({'Comments':-1})
                break;
            //Source Filters: 
            case 'all':
                    filtersFanficList.push({})
                    break;
            case 'ao3':
                filtersFanficList.push({'Source':'AO3'})
                break;
            case 'ff':
                filtersFanficList.push({'Source':'FF'})
                break;  
            case 'backup':
                filtersFanficList.push({'Source':'Backup'})
                break; 
            //Search:
            case 'tags':
                console.log('filterValue:',filterValue)
                console.log('typeof filterValue:',typeof filterValue)
                console.log('filterValue 1:',filter.split('_')[0])
                console.log('filterValue 2:',filter.split('_')[1])
                filtersFanficList.push({'Tags': {$elemMatch: {[filter.split('_')[1]]:filterValue}}})
                break;
            case 'fanficId':
                filtersFanficList.push({'FanficID':Number(filterValue)})
                break;                 
            case 'author'://author with text
                filtersFanficList.push({'Author': {$regex : `.*${filterValue.replace('%20','')}.*`, '$options' : 'i'}})
                break;
            case 'title':
                filtersFanficList.push({'FanficTitle': {$regex : `.*${filterValue.replace('%20','')}.*`, '$options' : 'i'}})
                break;
            case 'categories':
                console.log('filterValue:',filterValue)
                filtersFanficList.push({'Categories': {$all: filterValue.replace('%20','').split(',')}})
                break;
            case 'wordsFrom':
                    if(wordsFlag){
                        index = filtersFanficList.findIndex(x => x.Words)
                        filtersFanficList[index].Words = Object.assign(filtersFanficList[index].Words,{$gte: Number(filterValue)})
                    }else{
                        filtersFanficList.push({'Words':{$gte: Number(filterValue)}})
                        sortList.push({'Words':-1})
                        wordsFlag = true;
                    }
                    break;                                            
            case 'wordsTo':
                    if(wordsFlag){
                        index = filtersFanficList.findIndex(x => x.Words)
                        filtersFanficList[index].Words = Object.assign(filtersFanficList[index].Words,{$lte: Number(filter.split('_').pop())})
                    }else{
                        filtersFanficList.push({'Words':{$lte: Number(filter.split('_').pop())}})
                        sortList.push({'Words':-1})
                        wordsFlag = true;
                    }
                    break;                              
        }
    })
    
    if(finishFlag && !inProgressFlag){
        filtersUserList.push({'FanficList.Status':'Finished'});
    }
    let ignoreList = await getIgnoredList(userEmail);

    if (ignoreList.length>0 && searchWithIgnoreFlag && filtersUserList.length===0){
        filtersFanficList.push({ FanficID : { $nin: ignoreList }})
        ignoreList = [] 
    }else if(!searchWithIgnoreFlag){
        ignoreList = [] 
    }

    console.log('[filtersUserList,filtersFanficList]: ',[filtersUserList,filtersFanficList,sortList])
    return [filtersUserList,filtersFanficList,sortList,ignoreList]
    

}