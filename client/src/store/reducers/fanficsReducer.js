import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../utils/sharedFunctions';

const initialState ={
    fanfic: null,
    fanfics: [],
    userFanfics: [],
    error: null,
    message:'',
    loading: false,
    counter:0,
    readingListsNames:[],
    readingListsFull:[],
    ignoredCount:0
}
//Get Fanfics From Server
const getFanficsFromDBStart  = (state,action) => {
    return updateObject(state,{loading: true});
}
const getFanficsFromDBSuccess  = (state,action) => {
    return updateObject(state,{
        fanfics: action.fanfics,
        userFanfics: action.userFanfics,
        readingListsNames:action.readingListsNames,
        ignoredCount: action.ignoredCount,
        counter: action.counter,
        loading: false
    })
}
const getReadingListsFromDBSuccess  = (state,action) => {
    return updateObject(state,{
        readingListsFull:action.readingListsFull,
        loading: false
    })
}
const getFanficsFromDBFail  = (state,action) => {
    return updateObject(state,{loading: false});   
}
// const getUserDataFromDBSuccess  = (state,action) => {
//     return updateObject(state,{
//         userFanfics: action.userFanfics,
//         loading: false
//     })
// }
// const getUserDataFromDBFail  = (state,action) => {
//     return updateObject(state,{loading: false});   
// }
const getFilteredFanficsFromDBSuccess  = (state,action) => {
    return updateObject(state,{
        fanfics: action.fanfics,
        userFanfics: action.userFanfics,
        ignoredCount: action.ignoredCount,
        counter: action.counter,
        loading: false
    })
}
const getFilteredFanficsFromDBFail  = (state,action) => {
    return updateObject(state,{loading: false});   
}
const reducer = (state = initialState,action) =>{
    switch(action.type){
        case actionTypes.GET_FANFICS_START:                             return getFanficsFromDBStart(state,action)                                    
        case actionTypes.GET_FANFICS_SUCCESS:                           return getFanficsFromDBSuccess(state,action)                                    
        case actionTypes.GET_FANFICS_FAIL:                              return getFanficsFromDBFail(state,action)  
        
        case actionTypes.GET_FILTERED_FANFICS_SUCCESS:                  return getFilteredFanficsFromDBSuccess(state,action)                                    
        case actionTypes.GET_FILTERED_FANFICS_FAIL:                     return getFilteredFanficsFromDBFail(state,action)  
        
        case actionTypes.GET_READING_LISTS_SUCCESS:                     return getReadingListsFromDBSuccess(state,action)                                    
        // case actionTypes.GET_USER_FANFICS_DATA_SUCCESS:                 return getUserDataFromDBSuccess(state,action)                                    
        // case actionTypes.GET_USER_FANFICS_DATA_FAIL:                    return getUserDataFromDBFail(state,action)                                    

        default: return state;
    }
}

export default reducer;