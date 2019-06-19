import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getFanficsFromDBStart = () =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBStart')
    return{
        type: actionTypes.GET_FANFICS_START
    };
};

export const getFanficsFromDBSuccess = (fanfics) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBSuccess')
    return{
        type: actionTypes.GET_FANFICS_SUCCESS,
        fanfics: fanfics
    };
};

export const getFanficsFromDBFail = (error) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBFail')
    return{
        type: actionTypes.GET_FANFICS_FAIL,
        error: error
    };
};

export const getFanficsFromDB = (FandomName,pageNumber,pageLimit) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDB')
    let skip = (pageLimit*pageNumber)-pageLimit+1;
    // let limit = pageLimit*pageNumber;
    return dispatch =>{
        dispatch(getFanficsFromDBStart())
        return axios.get(`/db/getFanfics?FandomName=${FandomName.replace("&","%26")}&skip=${skip}&limit=${pageLimit}`)
        .then(fetchedFanfics =>{
            dispatch(getFanficsFromDBSuccess(fetchedFanfics.data));
            return true;
        })
        .catch(error =>{
            dispatch(getFanficsFromDBFail(error))
        })  
    };

};
