import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../utils/utility';
const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
};

const setCurrentUser = (state,action) =>{
    return updateObject(state,{
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
    });

}
const userLoading = (state,action) =>{
    return updateObject(state,{
        loading: true
    });
}
const getError = (state,action) =>{
    return action.payload;
}
export default function(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_CURRENT_USER:      return setCurrentUser(state,action)
        case actionTypes.USER_LOADING:          return userLoading(state,action)
        case actionTypes.GET_ERRORS:            return getError(state,action)
        default: return state;
    }
}