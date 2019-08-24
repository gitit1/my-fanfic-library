import * as actionTypes from './actionTypes';
import axios from '../axios-server';

export const getFanficsFromDBStart = () =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBStart')
    return{
        type: actionTypes.GET_FANFICS_START
    };
};

export const getFanficsFromDBSuccess = (fetchedData) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBSuccess')
    return{
        type: actionTypes.GET_FANFICS_SUCCESS,
        fanfics: fetchedData[0],
        userFanfics: fetchedData[1],
        ignoredCount: fetchedData[2],
        counter: 0
    };
};

export const getFanficsFromDBFail = (error) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBFail')
    return{
        type: actionTypes.GET_FANFICS_FAIL,
        error: error
    };
};

export const getFanficsFromDB = (fandomName,pageNumber,pageLimit,userEmail) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDB')
    let skip = (pageLimit*pageNumber)-pageLimit;

    return dispatch =>{
        dispatch(getFanficsFromDBStart())
        return axios.post(`/db/getFanfics?FandomName=${fandomName.replace("&","%26")}&skip=${skip}&limit=${pageLimit}&userEmail=${userEmail}`)
        .then(fetchedData =>{
            dispatch(getFanficsFromDBSuccess(fetchedData.data));
            return true;
        })
        .catch(error =>{
            dispatch(getFanficsFromDBFail(error))
        })  
    };

};

//FOLLOW , FAVORITE , IGNORE
export const addFanficToUserMarks = (userEmail,fandomName,fanficId,fanficTitle,markType,mark) =>{
    return dispatch =>{
        return axios.post(`/db/addFanficToUserMarks?fandomName=${fandomName}&fanficId=${fanficId}&fanficTitle=${fanficTitle}&userEmail=${userEmail}&markType=${markType}&mark=${mark}`)
        .then(res =>{
            return true;
        })
        .catch(error =>{
            return false
        })  
    };      
}

export const addFanficToUserStatus = (userEmail,fandomName,fanficId,fanficTitle,statusType,status,data) =>{
    let dateArg = data ? `&data=${data}` : '';

    return dispatch =>{
        return axios.post(`/db/addFanficToUserStatus?fandomName=${fandomName}&fanficId=${fanficId}&fanficTitle=${fanficTitle}&userEmail=${userEmail}&statusType=${statusType}&status=${status}${dateArg}`)
        .then(res =>{
            // dispatch(addFanficToUserFavoritesSuccess(fetchedFanfics.data));
            return true;
        })
        .catch(error =>{
            return false
            // dispatch(addFanficToUserFavoritesFail(error))
        })  
    };  
}

export const getFilteredFanficsFromDBSuccess = (fetchedData) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBSuccess')
    return{
        type: actionTypes.GET_FILTERED_FANFICS_SUCCESS,
        fanfics: fetchedData[0],
        userFanfics: fetchedData[1],
        counter: fetchedData[2]
    };
};

export const getFilteredFanficsFromDBFail = (error) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBFail')
    return{
        type: actionTypes.GET_FILTERED_FANFICS_FAIL,
        error: error
    };
};

export const getFilteredFanficsFromDB = (fandomName,userEmail,filters,pageLimit,pageNumber) =>{
    console.log('[actions: fanfics.js] - getFilteredFanficsFromDB')

    return dispatch =>{
        dispatch(getFanficsFromDBStart())
        //TODO: solution to limit
        return axios.post(`/db/getFilteredFanficsListFromDB?fandomName=${fandomName.replace("&","%26")}&userEmail=${userEmail}&pageLimit=${pageLimit}&pageNumber=${pageNumber}`,filters)
        .then(fetchedData =>{
            dispatch(getFilteredFanficsFromDBSuccess(fetchedData.data));
            return true;
        })
        .catch(error =>{
            dispatch(getFilteredFanficsFromDBFail(error))
        })  
    };
};
