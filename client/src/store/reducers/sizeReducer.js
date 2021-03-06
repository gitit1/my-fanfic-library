import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../utils/sharedFunctions';

const initialState = {
    size: null,
    smallSize:null
};

const saveScreenSize = (state,action) =>{
    return updateObject(state,{
        size: action.size,
        smallSize:action.smallSize
    });
}

export default function(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SAVE_SCREEN_SIZE:      return saveScreenSize(state,action)
        default: return state;
    }
}