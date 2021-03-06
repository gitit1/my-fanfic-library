import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/sharedFunctions';
const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    isManager: false,
    user: {},
    userData: {},
    loading: false,
    siteVer: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 1 : (window.location.href.includes('mfl')) ? 3 : 2
};

const setCurrentUser = (state, action) => {
    const manager = (!isEmpty(action.payload) && action.payload.level === 1) ? true : false
    return updateObject(state, {
        isAuthenticated: !isEmpty(action.payload),
        isManager: manager,
        user: action.payload
    });
}
const setCurrentUserData = (state, action) => {
    return updateObject(state, {
        userData: action.payload
    });

}
const userLoading = (state, action) => {
    return updateObject(state, {
        loading: true
    });
}
const getError = (state, action) => {
    return action.payload;
}
export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_CURRENT_USER: return setCurrentUser(state, action)
        case actionTypes.SET_CURRENT_USERDATA: return setCurrentUserData(state, action)
        case actionTypes.USER_LOADING: return userLoading(state, action)
        case actionTypes.GET_ERRORS: return getError(state, action)
        default: return state;
    }
}