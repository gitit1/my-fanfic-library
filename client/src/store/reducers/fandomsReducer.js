import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const initialState ={
    fandom: null,
    fandoms: [],
    error: null,
    loading: false
}

const fandomInit = (state,action) => {
    return updateObject(state,{fandom: null});
}
const getFandomsFromDBStart  = (state,action) => {
    return updateObject(state,{loading: true});
}
const getFandomsFromDBSuccess  = (state,action) => {
    return updateObject(state,{
        fandoms: action.fandoms,
        loading: false
    })
}
const getFandomsFromDBFail  = (state,action) => {
    return updateObject(state,{loading: false});   
}


const reducer = (state = initialState,action) =>{
    switch(action.type){
        case actionTypes.FANDOM_INIT:                   return fandomInit(state,action)                                    
        case actionTypes.FANDOMS_START:                 return getFandomsFromDBStart(state,action)                                    
        case actionTypes.FANDOMS_SUCCESS:               return getFandomsFromDBSuccess(state,action)                                    
        case actionTypes.FANDOMS_FAIL:                  return getFandomsFromDBFail(state,action)                                    
        default: return state;
    }
}

export default reducer;