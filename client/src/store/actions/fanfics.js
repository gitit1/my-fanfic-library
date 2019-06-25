import * as actionTypes from './actionTypes';
import axios from 'axios';

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
        userFanfics: fetchedData[1]
    };
};

export const getFanficsFromDBFail = (error) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBFail')
    return{
        type: actionTypes.GET_FANFICS_FAIL,
        error: error
    };
};

export const getFanficsFromDB = (FandomName,pageNumber,pageLimit,userEmail) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDB')
    let skip = (pageLimit*pageNumber)-pageLimit+1;
    // let limit = pageLimit*pageNumber;
    return dispatch =>{
        dispatch(getFanficsFromDBStart())
        return axios.get(`/db/getFanfics?FandomName=${FandomName.replace("&","%26")}&skip=${skip}&limit=${pageLimit}&userEmail=${userEmail}`)
        .then(fetchedData =>{
            dispatch(getFanficsFromDBSuccess(fetchedData.data));
            return true;
        })
        .catch(error =>{
            dispatch(getFanficsFromDBFail(error))
        })  
    };

};


export const addFanficToUserFavorites = (userEmail,fandomName,fanficId,favorite) =>{
    console.log('[actions: fanfics.js] - addFanficToUserFavorites') 
    console.log('[actions: fanfics.js] - favorite:',favorite) 
    return dispatch =>{
        return axios.post(`/db/addFanficToUserFavorites?fandomName=${fandomName}&fanficId=${fanficId}&userEmail=${userEmail}&favorite=${favorite}`)
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
        fanfics: fetchedData
    };
};

export const getFilteredFanficsFromDBFail = (error) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBFail')
    return{
        type: actionTypes.GET_FILTERED_FANFICS_FAIL,
        error: error
    };
};

export const getFilteredFanficsFromDB = (fandomName,userEmail) =>{
    console.log('[actions: fanfics.js] - getFilteredFanficsFromDB')

    return dispatch =>{
        dispatch(getFanficsFromDBStart())
        //TODO: solution to limit
        return axios.post(`/db/getFilteredFanficsListFromDB?fandomName=${fandomName.replace("&","%26")}&userEmail=${userEmail}`)
        .then(fetchedData =>{
            //dispatch(getFilteredFanficsFromDBSuccess(fetchedData.data));
            console.log('fetchedData.data:',fetchedData.data)
            return fetchedData.data;
        })
        .catch(error =>{
            //dispatch(getFilteredFanficsFromDBFail(error))
        })  
    };

};
