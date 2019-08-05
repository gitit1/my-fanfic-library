import * as actionTypes from './actionTypes';
import axios from '../axios-server';

export const getDataOfFanficStart = () =>{
    console.log('[actions: fandom.js] - getFandomsFromDBStart')
    return{
        type: actionTypes.GET_FANFIC_DATA_START
    };
};

export const getDataOfFanficSuccess = (fanficData) =>{
    console.log('[actions: fandom.js] - getFandomsFromDBSuccess')
    return{
        type: actionTypes.GET_FANFIC_DATA_SUCCESS,
        fanfic: fanficData
    };
};

export const getDataOfFanficFail = (error) =>{
    console.log('[actions: fandom.js] - getFandomsFromDBFail')
    return{
        type: actionTypes.GET_FANFIC_DATA_FAIL,
        error: error
    };
};

export const getDataOfFanfic = (url,fandomName,download,image) =>{
    image=null;
    console.log('[actions: fandom.js] - getFandomsFromDB')
    return dispatch =>{
        dispatch(getDataOfFanficStart())
        return axios.get(`/otherfanficssites/getFanficData?url=${url}&fandomName=${fandomName}&download=${download}&image=${image}`)
        .then(fetchedData =>{
            dispatch(getDataOfFanficSuccess(fetchedData.data));
            return true;
        })
        .catch(error =>{
            dispatch(getDataOfFanficFail(error))
        })  
    };
};