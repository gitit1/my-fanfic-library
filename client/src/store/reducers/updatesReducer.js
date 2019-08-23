import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../utils/sharedFunctions';

const initialState ={
    latestUpdates: null,
    loading: false,
    error: null
}
//Get Fandom From Server
const getUpdatesStart  = (state,action) => {
    return updateObject(state,{loading: true});
}
const getLatestUpdatesSuccess  = (state,action) => {
    return updateObject(state,{
        latestUpdates: action.latestUpdates,
        loading: false
    })
}
const getUpdatesFail  = (state,action) => {
    return updateObject(state,{loading: false,error: action.error});   
}


const reducer = (state = initialState,action) =>{
    switch(action.type){
        case actionTypes.GET_UPDATES_START:           return getUpdatesStart(state,action)                                    
        case actionTypes.GET_UPDATES_SUCCESS:         return getLatestUpdatesSuccess(state,action)                                    
        case actionTypes.GET_UPDATES_FAIL:            return getUpdatesFail(state,action)                                                         
        
        default: return state;
    }
}

export default reducer;