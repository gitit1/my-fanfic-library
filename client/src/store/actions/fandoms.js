import * as actionTypes from './actionTypes';
import axios from 'axios';


export const getFandomsFromDBStart = () =>{
    return{
        type: actionTypes.GET_FANDOMS_START
    };
};

export const getFandomsFromDBSuccess = (fandoms) =>{
    return{
        type: actionTypes.GET_FANDOMS_SUCCESS,
        fandoms: fandoms
    };
};

export const getFandomsFromDBFail = (error) =>{
    return{
        type: actionTypes.GET_FANDOMS_FAIL,
        error: error
    };
};

export const getFandomsFromDB = () =>{
    console.log('[action] getFandomsFromDB')
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
    return{
        type: actionTypes.EDIT_FANDOM_START
    };
};

export const editFandomDataSuccess = (message,fandoms) =>{
    console.log('message:',message)
    return{
        type: actionTypes.EDIT_FANDOM_SUCCESS,
        fandoms: fandoms,
        message: message
    };
};

export const editFandomDataFail = (error) =>{
    return{
        type: actionTypes.EDIT_FANDOM_FAIL,
        error: error
    };
};

export const addFandomToDB = (fandomName,oldFandomName,mode,fandom,image) =>{
    console.log('[action] addFandomToDB')
    return dispatch =>{
        dispatch(editFandomDataStart())
        console.log(`${fandomName}&oldFandomName=${oldFandomName}&mode=${mode}&Image=${image}`)
        return axios.post(`/db/addEditFandom?fandomName=${fandomName}&oldFandomName=${oldFandomName}&mode=${mode}&Image=${image}`,fandom)
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
    console.log('[action] deleteFandomFromDB')
    return dispatch =>{
        dispatch(editFandomDataStart())
        return axios.post(`/db/deleteFandom?id=${id}&fandomName=${fandomName}`)
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
    return{
        type: actionTypes.GET_FANDOM,
        fandom: fandom
    };
}

export const testSocket = () => {
    return{
        type: actionTypes.TEST_SOCKET
    }
}