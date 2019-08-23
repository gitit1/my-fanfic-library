import * as actionTypes from './actionTypes';
import axios from '../axios-server';

export const getUpdatesStart = () =>{
    console.log('[actions: fandom.js] - getUpdatesStart')
    return{
        type: actionTypes.GET_UPDATES_START
    };
};

export const getLatestUpdatesSuccess = (latestUpdates) =>{
    console.log('[actions: fandom.js] - getLatestUpdatesSuccess')
    return{type: actionTypes.GET_UPDATES_SUCCESS,latestUpdates};
};

export const getUpdatesFail = (error) =>{
    console.log('[actions: fandom.js] - getUpdatesFail')
    return{
        type: actionTypes.GET_UPDATES_FAIL,
        error: error
    };
};

export const getLatestUpdates = (fandoms) =>{
    console.log('[actions: fandom.js] - getLatestUpdates')
    return dispatch =>{
        dispatch(getUpdatesStart())
        return axios.post('/updates/latestUpdates',fandoms)
        .then(latestUpdates =>{
            dispatch(getLatestUpdatesSuccess(latestUpdates.data));
            return true;
        })
        .catch(error =>{
            dispatch(getUpdatesFail(error))
        })  
    };
};