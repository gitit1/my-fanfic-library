import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../utils/sharedFunctions';

const initialState ={
    latestUpdates: null,
    myLatestActivities:null,
    myFanficsUpdates:null,
    loading: false,
    error: null
}
//Get Fandom From Server
const getUpdatesStart  = (state,action) => {
    return updateObject(state,{loading: true});
}
const getUpdatesFail  = (state,action) => {
    return updateObject(state,{loading: false,error: action.error});   
}
const getLatestUpdatesSuccess  = (state,action) => {
    return updateObject(state,{
        latestUpdates: action.latestUpdates,
        loading: false
    })
}
const getMyLatestActivitiesSuccess  = (state,action) => {
    return updateObject(state,{
        myLatestActivities: action.myLatestActivities,
        loading: false
    })
}
const getMyFanficsUpdatesSuccess  = (state,action) => {
    return updateObject(state,{
        myFanficsUpdates: action.myFanficsUpdates,
        loading: false
    })
}


const reducer = (state = initialState,action) =>{
    switch(action.type){
        case actionTypes.GET_UPDATES_START:                 return getUpdatesStart(state,action)                                    
        case actionTypes.GET_UPDATES_FAIL:                  return getUpdatesFail(state,action)                                                         
        case actionTypes.GET_LATEST_UPDATES_SUCCESS:        return getLatestUpdatesSuccess(state,action)                                    
        case actionTypes.GET_MY_LATEST_ACTIVITIES_SUCCESS:  return getMyLatestActivitiesSuccess(state,action)                                    
        case actionTypes.GET_MY_FANFICS_UPDATES_SUCCESS:    return getMyFanficsUpdatesSuccess(state,action)                                    
        
        default: return state;
    }
}

export default reducer;