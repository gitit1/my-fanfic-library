import * as actionTypes from './actionTypes';
import axios from 'axios';


export const getFandomsFromDBStart = () =>{
    console.log('[actions: fandom.js] - getFandomsFromDBStart')
    return{
        type: actionTypes.GET_FANDOMS_START
    };
};

export const getFandomsFromDBSuccess = (fandoms) =>{
    console.log('[actions: fandom.js] - getFandomsFromDBSuccess')
    return{
        type: actionTypes.GET_FANDOMS_SUCCESS,
        fandoms: fandoms
    };
};

export const getFandomsFromDBFail = (error) =>{
    console.log('[actions: fandom.js] - getFandomsFromDBFail')
    return{
        type: actionTypes.GET_FANDOMS_FAIL,
        error: error
    };
};

export const getFandomsFromDB = () =>{
    console.log('[actions: fandom.js] - getFandomsFromDB')
    return dispatch =>{
        dispatch(getFandomsFromDBStart())
        return axios.get('/db/getAllFandoms')
        .then(fetchedFandoms =>{
            dispatch(getFandomsFromDBSuccess(fetchedFandoms.data));
            return true;
        })
        .catch(error =>{
            dispatch(getFandomsFromDBFail(error))
        })  
    };
};

export const editFandomDataStart = () =>{
    console.log('[actions: fandom.js] - editFandomDataStart')
    return{
        type: actionTypes.EDIT_FANDOM_START
    };
};

export const editFandomDataSuccess = (message,fandoms) =>{
    console.log('[actions: fandom.js] - editFandomDataSuccess')
    return{
        type: actionTypes.EDIT_FANDOM_SUCCESS,
        fandoms: fandoms,
        message: message
    };
};

export const editFandomDataFail = (error) =>{
    console.log('[actions: fandom.js] - editFandomDataFail')
    return{
        type: actionTypes.EDIT_FANDOM_FAIL,
        error: error
    };
};

export const addFandomToDB = (fandomName,mode,fandom,image,imageDate) =>{
    console.log('[actions: fandom.js] - addFandomToDB')
    return dispatch =>{
        dispatch(editFandomDataStart())
        return axios.post(`/db/addEditFandom?fandomName=${fandomName.replace("&","%26")}&mode=${mode}&image=${image}&imageDate=${imageDate}`,fandom)
        .then(res =>{
            dispatch(getFandomsFromDB())
            dispatch(editFandomDataSuccess(res.data));
            return true;
        })
        .catch(error =>{
            dispatch(editFandomDataFail(error))
        })  
    };
};

export const deleteFandomFromDB = (id,fandomName) =>{
    console.log('[actions: fandom.js] - deleteFandomFromDB')
    return dispatch =>{
        dispatch(editFandomDataStart())
        return axios.post(`/db/deleteFandom?id=${id}&fandomName=${fandomName.replace("&","%26")}`)
        .then(async res =>{
            await dispatch(getFandomsFromDB())
            await dispatch(editFandomDataSuccess(res.data));
            return true;
        })
        .catch(error =>{
            dispatch(editFandomDataFail(error))
        })  
    };
};

export const getFandom = (fandom) =>{
    console.log('[actions: fandom.js] - getFandom')
    return{
        type: actionTypes.GET_FANDOM,
        fandom: fandom
    };
}

