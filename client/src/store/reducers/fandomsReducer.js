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
const getFandom = (state,action) =>{
        return updateObject(state,{
                                fandom: action.fandom                         
                                });    
}
//Add Fandom To Server
const editFandomDataStart  = (state,action) => {
    return updateObject(state,{
                                fandom: null,
                                error: null,
                                message:'',
                                loading:true
                              });
}
const editFandomDataSuccess  = (state,action) => {
    return updateObject(state,{
                                message: action.message,
                                loading: false
                              })
}
const editFandomDataFail  = (state,action) => {
    return updateObject(state,{
                                error:action.error,
                                message:'Error',
                                loading: false                                
                              });   
}

const reducer = (state = initialState,action) =>{
    switch(action.type){
        case actionTypes.GET_FANDOMS_START:                 return getFandomsFromDBStart(state,action)                                    
        case actionTypes.GET_FANDOMS_SUCCESS:               return getFandomsFromDBSuccess(state,action)                                    
        case actionTypes.GET_FANDOMS_FAIL:                  return getFandomsFromDBFail(state,action)                                                                    
        case actionTypes.EDIT_FANDOM_START:                 return editFandomDataStart(state,action)                                    
        case actionTypes.EDIT_FANDOM_SUCCESS:               return editFandomDataSuccess(state,action)                                    
        case actionTypes.EDIT_FANDOM_FAIL:                  return editFandomDataFail(state,action)                                    
        
        case actionTypes.GET_FANDOM:                        return getFandom(state,action)                                    
        
        default: return state;
    }
}

export default reducer;