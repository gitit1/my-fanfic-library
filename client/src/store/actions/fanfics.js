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


export const addFanficToUserFavorites = (userEmail,fanficId,favorite) =>{
    console.log('[actions: fanfics.js] - addFanficToUserFavorites') 
    console.log('[actions: fanfics.js] - favorite:',favorite) 
    return dispatch =>{
        return axios.post(`/db/addFanficToUserFavorites?fanficId=${fanficId}&userEmail=${userEmail}&favorite=${favorite}`)
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
// export const addFanficToUserFavoritesSuccess = (fanfics) =>{
//     console.log('[actions: fanfics.js] - getFanficsFromDBSuccess')
//     return{
//         type: actionTypes.GET_FANFICS_SUCCESS,
//         fanfics: fanfics
//     };
// };

// export const addFanficToUserFavoritesFail = (error) =>{
//     console.log('[actions: fanfics.js] - getFanficsFromDBFail')
//     return{
//         type: actionTypes.GET_FANFICS_FAIL,
//         error: error
//     };
// };
// export const getUserDataFromDB = (fanfics,userEmail) =>{
//     console.log('[actions: fanfics.js] - addFanficToUserFavorites') 
//     return dispatch =>{
//         return axios.post(`/db/addFanficToUserFavorites?userEmail=${userEmail}`,fanfics)
//         .then(userFanfics =>{
//             dispatch(getUserDataFromDB(userFanfics.data));
//             return true;
//         })
//         .catch(error =>{
//             dispatch(getUserDataFromDBFail(error))
//             return false
//         })  
//     };      
// }
// export const getUserDataFromDBSuccess = (userFanfics) =>{
//     console.log('[actions: fanfics.js] - getFanficsFromDBSuccess')
//     return{
//         type: actionTypes.GET_USER_FANFICS_DATA_SUCCESS,
//         userFanfics: userFanfics
//     };
// };

// export const getUserDataFromDBFail = (error) =>{
//     console.log('[actions: fanfics.js] - getFanficsFromDBFail')
//     return{
//         type: actionTypes.GET_USER_FANFICS_DATA_FAIL,
//         error: error
//     };
// };