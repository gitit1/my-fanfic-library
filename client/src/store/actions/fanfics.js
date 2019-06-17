import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getFanficsFromDBStart = () =>{
    return{
        type: actionTypes.GET_FANFICS_START
    };
};

export const getFanficsFromDBSuccess = (fanfics) =>{
    return{
        type: actionTypes.GET_FANFICS_SUCCESS,
        fanfics: fanfics
    };
};

export const getFanficsFromDBFail = (error) =>{
    return{
        type: actionTypes.GET_FANFICS_FAIL,
        error: error
    };
};

export const getFanficsFromDB = (FandomName,pageNumber,pageLimit) =>{
    console.log('[action] getFanficsFromDB')
    let startPage = (pageLimit*pageNumber)-pageLimit+1;
    let endPage = pageLimit*pageNumber;
    return dispatch =>{
        dispatch(getFanficsFromDBStart())
        return axios.get(`/db/getFanfics?FandomName=${FandomName.replace("&","%26")}&startPage=${startPage}&endPage=${endPage}`)
        .then(fetchedFanfics =>{
            dispatch(getFanficsFromDBSuccess(fetchedFanfics.data));
            return true;
        })
        .catch(error =>{
            dispatch(getFanficsFromDBFail(error))
        })  
    };

};
