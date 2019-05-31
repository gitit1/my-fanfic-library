import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const initialState ={
    fandom: null
}

const fandomInit = (state,action) => {
    return updateObject(state,{purchased: false});
}

const reducer = (state = initialState,action) =>{
    switch(action.type){
        case actionTypes.FANDOM_INIT:               return fandomInit(state,action)                                    
        default: return state;
    }
}

export default reducer;