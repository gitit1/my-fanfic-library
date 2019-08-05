import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../utils/sharedFunctions';

const initialState ={
    fanfic: null,
    error: null,
    loading: false
}

const getFanficDataStart  = (state,action) => {
    return updateObject(state,{loading: true});
}
const getFanficDataSuccess  = (state,action) => {
    return updateObject(state,{
        fanfic: action.fanfic,
        loading: false
    })
}
const getFanficDataFail  = (state,action) => {
    return updateObject(state,{loading: false});   
}

const reducer = (state = initialState,action) =>{
    switch(action.type){
        case actionTypes.GET_FANFIC_DATA_START:                 return getFanficDataStart(state,action)                                    
        case actionTypes.GET_FANFIC_DATA_SUCCESS:               return getFanficDataSuccess(state,action)                                    
        case actionTypes.GET_FANFIC_DATA_FAIL:                  return getFanficDataFail(state,action)                                                                                                       
        
        default: return state;
    }
}

export default reducer;