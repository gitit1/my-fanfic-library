import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const initialState ={
    fandom: null,
    fandoms: [],
    error: null,
    message:'',
    loading: false
}
//Get Fandom From Server
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
//Add Fandom To Server
// const fandomInit = (state,action) => {
//     return updateObject(state,{fandom: null});
// }
const addFandomToDBStart  = (state,action) => {
    return updateObject(state,{
                                fandom: null,
                                error: null,
                                message:'',
                                loading:true
                              });
}
const addFandomToDBSuccess  = (state,action) => {
    return updateObject(state,{
                                message: action.message,
                                loading: false
                              })
}
const addFandomToDBFail  = (state,action) => {
    return updateObject(state,{
                                loading: false,
                                error:action.error
                              });   
}


const reducer = (state = initialState,action) =>{
    switch(action.type){
        case actionTypes.GET_FANDOMS_START:                 return getFandomsFromDBStart(state,action)                                    
        case actionTypes.GET_FANDOMS_SUCCESS:               return getFandomsFromDBSuccess(state,action)                                    
        case actionTypes.GET_FANDOMS_FAIL:                  return getFandomsFromDBFail(state,action)                                    
        // case actionTypes.FANDOM_INIT:                       return fandomInit(state,action)                                    
        case actionTypes.ADD_FANDOM_START:                  return addFandomToDBStart(state,action)                                    
        case actionTypes.ADD_FANDOM_SUCCESS:                return addFandomToDBSuccess(state,action)                                    
        case actionTypes.ADD_FANDOM_FAIL:                   return addFandomToDBFail(state,action)                                    
        default: return state;
    }
}

export default reducer;