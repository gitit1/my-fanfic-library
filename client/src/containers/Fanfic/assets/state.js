
import {filtersArrayInit,filtersArrayAttr} from '../components/Filters/assets/FiltersArray';
import {fanficsNumbersList} from '../components/FanficsNumbers/assets/fanficsNumbersList';

export let state={
    userFanfics:[],
    filters: filtersArrayAttr,
    filterArr: [],
    addImageFlag:null,
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
    fandomName:null,
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
    dataLoad:false,
    switches:[
        {
            id:'tags',
            checked:true,
            label:'Show Tags',
            manager:false
        },
        {
            id:'images',
            checked:false,
            label:'Show Images',
            manager:false
        },
        {
            id:'noUserData',
            checked:true,
            label:'Show Marked Stories',
            manager:false
        },
        {
            id:'manager-buttons',
            checked:true,
            label:'Show Manager Buttons',
            manager:true
        }
    ]

};