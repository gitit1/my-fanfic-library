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
    return dispatch =>{
        dispatch(getFandomsFromDBStart())
        return axios.get('/db/getAllFandoms')
        .then(res =>{
            const fetchedFandoms= []
            for(let key in res.data){
                fetchedFandoms.push({...res.data[key],id: key});
            }
            dispatch(getFandomsFromDBSuccess(fetchedFandoms));
            return true;
        })
        .catch(error =>{
            dispatch(getFandomsFromDBFail(error))
        })  
    };
};

// export const fandomInit = () =>{
//     return{
//         type: actionTypes.FANDOM_INIT
//     };
// }

export const editFandomDataStart = () =>{
    return{
        type: actionTypes.EDIT_FANDOM_START
    };
};

export const editFandomDataSuccess = (message) =>{
    return{
        type: actionTypes.EDIT_FANDOM_SUCCESS,
        message: message
    };
};

export const editFandomDataFail = (error) =>{
    return{
        type: actionTypes.EDIT_FANDOM_FAIL,
        error: error
    };
};

export const addFandomToDB = (fandom_Name,mode,fandom,image) =>{
    return dispatch =>{
        dispatch(editFandomDataStart())
        return axios.post(`/db/addEditFandom?Fandom_Name=${fandom_Name}&mode=${mode}&Image=${image}`,fandom)
        .then(res =>{
            dispatch(editFandomDataSuccess(res.data));
            return true;
        })
        .catch(error =>{
            dispatch(editFandomDataFail(error))
        })  
    };
};

export const deleteFandomFromDB = (id,Fandom_Name) =>{
    return dispatch =>{
        dispatch(editFandomDataStart())
        return axios.post(`/db/deleteFandom?id=${id}&Fandom_Name=${Fandom_Name}`)
        .then(res =>{
            dispatch(editFandomDataSuccess(res.data));
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