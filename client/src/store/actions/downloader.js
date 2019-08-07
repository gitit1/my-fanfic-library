import * as actionTypes from './actionTypes';
import axios from '../axios-server';

export const downloaderStart    = ()            =>      {return{type: actionTypes.DOWNLOADER_START}};
export const downloaderFail     = (error)       =>      {return{type: actionTypes.DOWNLOADER_FAIL,error: error};};
export const downloaderSuccess  = (fanficData)  =>      {return{type: actionTypes.GET_FANFIC_DATA_SUCCESS}};

export const getDataOfFanficSuccess = (fanficData) =>{
    console.log('[actions: fandom.js] - getFandomsFromDBSuccess')
    return{
        type: actionTypes.GET_FANFIC_DATA_SUCCESS,
        fanfic: fanficData[0],
        similarFanfic: fanficData[1] ? fanficData[1] : null
    };
};


export const getDataOfFanfic = (url,fandomName,download,image) =>{
    image=null;
    console.log('[actions: fandom.js] - getFandomsFromDB')
    return dispatch =>{
        dispatch(downloaderStart())
        return axios.get(`/otherfanficssites/getFanficData?url=${url}&fandomName=${fandomName}&download=${download}&image=${image}`)
        .then(fetchedData =>{
            dispatch(getDataOfFanficSuccess(fetchedData.data));
            return true;
        })
        .catch(error =>{
            dispatch(downloaderFail(error))
        })  
    };
};


export const saveDataOfFanficToDB = (fandomName,fanfic,download,url,image) =>{
    image=null;
    console.log('[actions: fandom.js] - getFandomsFromDB')
    return dispatch =>{
        dispatch(downloaderStart())
        return axios.post(`/otherfanficssites/saveDataOfFanficToDB?url=${url}&fandomName=${fandomName}&download=${download}&image=${image}`,fanfic)
        .then(res =>{
            dispatch(downloaderSuccess())
            return true;
        })
        .catch(error =>{
            dispatch(downloaderFail(error))
        })  
    };
};