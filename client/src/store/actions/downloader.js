import * as actionTypes from './actionTypes';
import axios from '../axios-server';

export const downloaderStart    = ()            =>      {return{type: actionTypes.DOWNLOADER_START}};
export const downloaderFail     = (error)       =>      {return{type: actionTypes.DOWNLOADER_FAIL,error: error};};
export const downloaderSuccess  = ()            =>      {return{type: actionTypes.DOWNLOAD_FANFIC_DATA_SUCCESS}};

export const getDataOfFanficSuccess = (fanficData) =>{
    return{
        type: actionTypes.GET_FANFIC_DATA_SUCCESS,
        fanfic: fanficData ? fanficData[0] : null,
        similarFanfic: fanficData[1] ? fanficData[1] : null
    };
};

export const backupDB = () => {
    console.log('[actions: fandom.js] - backupDB')
    // console.log('fanfic:',fanfic)
    return dispatch =>{
        dispatch(downloaderStart())
        return axios.get(`/db/backupDB`)
        .then(() =>{
            dispatch(downloaderSuccess())
            return true;
        })
        .catch(error =>{
            dispatch(downloaderFail(error))
        })  
    };
}

export const getDataOfFanfic = (type,fandomName,url,fanficData) =>{
    console.log('[actions: fandom.js] - getFandomsFromDB');

    return dispatch =>{
        dispatch(downloaderStart())
        if(type==='automatic'){
            console.log(`getDataOfFanfic - ${type}`)
            return axios.get(`/downloader/getFanficData?type=${type}&url=${url}&fandomName=${fandomName}` )
                .then(fetchedData =>{
                    dispatch(getDataOfFanficSuccess(fetchedData.data)).then(()=>{return true});
                })
                .catch(error =>{
                    dispatch(downloaderFail(error))
                })  
        }else{
            return axios.post(`/downloader/getFanficData?type=${type}&fandomName=${fandomName}`,fanficData)
                .then(fetchedData =>{
                    dispatch(getDataOfFanficSuccess(fetchedData.data)).then(()=>{return true});
                })
                .catch(error =>{
                    dispatch(downloaderFail(error))
                })  
        }

    };
};

export const saveDataOfFanficToDB = (fandomName,fanfic,download,url,image) =>{
    image=null;
    console.log('[actions: fandom.js] - getFandomsFromDB')
    return dispatch =>{
        dispatch(downloaderStart())
        return axios.post(`/downloader/saveNewFanfic?url=${url}&fandomName=${fandomName}&download=${download}&image=${image}`,fanfic)
        .then(res =>{
            dispatch(downloaderSuccess())
            return true;
        })
        .catch(error =>{
            dispatch(downloaderFail(error))
        })  
    };
};

export const updateFanficData = (fandomName,fanfic) =>{
    console.log('[actions: fandom.js] - getFandomsFromDB')
    // console.log('fanfic:',fanfic)
    return dispatch =>{
        dispatch(downloaderStart())
        return axios.post(`/downloader/updateExistFanfic?fandomName=${fandomName}`,fanfic)
        .then(res =>{
            dispatch(downloaderSuccess())
            return true;
        })
        .catch(error =>{
            dispatch(downloaderFail(error))
        })  
    };
};