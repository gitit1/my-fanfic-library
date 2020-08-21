import * as actionTypes from './actionTypes';
import axios from '../axios-server';

const isDev = (process.env.NODE_ENV === 'development');

export const getFandomsFromDBStart = () =>{
    isDev && console.log('[actions: fandoms] - getFandomsFromDBStart')
    return{
        type: actionTypes.GET_FANDOMS_START
    };
};

export const getFandomsFromDBSuccess = (fandoms) =>{
    isDev && console.log('[actions: fandoms] - getFandomsFromDBSuccess')
    return{
        type: actionTypes.GET_FANDOMS_SUCCESS,
        fandoms: fandoms
    };
};

export const getFandomsFromDBFail = (error) =>{
    isDev && console.log('[actions: fandoms] - getFandomsFromDBFail')
    return{
        type: actionTypes.GET_FANDOMS_FAIL,
        error: error
    };
};

export const getFandomsFromDB = () =>{
    isDev && console.log('[actions: fandoms] - getFandomsFromDB')
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
    isDev && console.log('[actions: fandom.js] - editFandomDataStart')
    return{
        type: actionTypes.EDIT_FANDOM_START
    };
};

export const editFandomDataSuccess = (message,fandoms) =>{
    isDev && console.log('[actions: fandom.js] - editFandomDataSuccess')
    return{
        type: actionTypes.EDIT_FANDOM_SUCCESS,
        fandoms: fandoms,
        message: message
    };
};

export const editFandomDataFail = (error) =>{
    isDev && console.log('[actions: fandom.js] - editFandomDataFail')
    return{
        type: actionTypes.EDIT_FANDOM_FAIL,
        error: error
    };
};

export const addFandomToDB = (fandomName,mode,fandom,mainImage,mainImageGif,iconImage,fanficImage) =>{
    isDev && console.log('[actions: fandom.js] - addFandomToDB')
    let images = '';
    images = (mainImage!==false)        ? (images+`&mainImage=${mainImage}`) : '';
    images = (mainImageGif!==false)     ? (images+`&mainImageGif=${mainImageGif}`) : images;
    images = (iconImage!==false)        ? (images+`&iconImage=${iconImage}`) : images;
    images = (fanficImage!==false)      ? (images+`&fanficImage=${fanficImage}`) : images;

    return dispatch =>{
        dispatch(editFandomDataStart())
        return axios.post(`/db/addEditFandom?fandomName=${fandomName.replace("&","%26")}&mode=${mode}${images}`,fandom)
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
    isDev && console.log('[actions: fandom.js] - deleteFandomFromDB')
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
    isDev && console.log('[actions: fandom.js] - getFandom')
    return{
        type: actionTypes.GET_FANDOM,
        fandom: fandom
    };
}

export const getLastUpdateDate = () =>{
    isDev && console.log('[actions: fandom.js] - getLastUpdateDate')
    return dispatch =>{
        return axios.get(`/db/getLastUpdateDate`)
        .then(res =>{
            return res.data
        })
        .catch(error =>{
            return false
        })  
    };    
}

export const getUserFandomsFromDBSuccess = (userFandoms) =>{
    isDev && console.log('[actions: fandom.js] - getUserFandomsFromDBSuccess')
    return{
        type: actionTypes.GET_USER_FANDOMS_SUCCESS,
        userFandoms: userFandoms
    };
};

export const getUserFandoms = (userEmail) =>{
    isDev && console.log('[actions: fandoms.js] - getUserFandoms')
    return dispatch =>{
        dispatch(getFandomsFromDBStart())
        return axios.post(`/db/getUserFandoms?userEmail=${userEmail}`)
        .then(res =>{
            dispatch(getUserFandomsFromDBSuccess(res.data));
            return true;
        })
        .catch(error =>{
            dispatch(getFandomsFromDBFail())
            return error
        });   
    }; 
}

export const addFandomToUserFavorite = (userEmail,fandomName,status) =>{
    isDev && console.log('[actions: fandoms.js] - addFandomToUserFavorite')
    return dispatch =>{
        return axios.post(`/db/addFandomToUserFavorites?userEmail=${userEmail}&fandomName=${fandomName.replace("&","%26")}&status=${status}`)
        .then(() =>{
            return true;
        })
        .catch(error =>{
            return error
        });   
    };   
}
