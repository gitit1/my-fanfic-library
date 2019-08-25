import * as actionTypes from './actionTypes';
import axios from '../axios-server';

export const getUpdatesStart = () =>{
    console.log('[actions: fandom.js] - getUpdatesStart')
    return{
        type: actionTypes.GET_UPDATES_START
    };
};

export const getUpdatesFail = (error) =>{
    console.log('[actions: fandom.js] - getUpdatesFail')
    return{
        type: actionTypes.GET_UPDATES_FAIL,
        error: error
    };
};

export const getLatestUpdatesSuccess = (latestUpdates) =>{
    console.log('[actions: fandom.js] - getLatestUpdatesSuccess')
    return{type: actionTypes.GET_LATEST_UPDATES_SUCCESS,latestUpdates};
};

export const getMyLatestActivitiesSuccess = (myLatestActivities) =>{
    console.log('[actions: fandom.js] - getMyLatestActivitiesSuccess')
    return{type: actionTypes.GET_MY_LATEST_ACTIVITIES_SUCCESS,myLatestActivities:myLatestActivities};
};

export const getMyFanficsUpdatesSuccess = (myFanficsUpdates) =>{
    console.log('[actions: fandom.js] - getMyLatestActivitiesSuccess')
    return{type: actionTypes.GET_MY_FANFICS_UPDATES_SUCCESS,myFanficsUpdates:myFanficsUpdates};
};

export const getLatestUpdates = (limit) =>{
    console.log('[actions: fandom.js] - getLatestUpdates')
    return dispatch =>{
        dispatch(getUpdatesStart())
        return axios.get(`/updates/latestUpdates?limit=${limit}`)
        .then(latestUpdates =>{
            dispatch(getLatestUpdatesSuccess(latestUpdates.data));
            return true;
        })
        .catch(error =>{
            dispatch(getUpdatesFail(error))
        })  
    };
};

export const getMyLatestActivities = (limit,userEmail) =>{
    console.log('[actions: fandom.js] - getMyLatestActivities')
    return dispatch =>{
        dispatch(getUpdatesStart());
        return axios.get(`/updates/myLatestActivities?userEmail=${userEmail}&limit=${limit}`)
        .then(myLatestActivities =>{
            dispatch(getMyLatestActivitiesSuccess(myLatestActivities.data));
            return true;
        })
        .catch(error =>{
            dispatch(getUpdatesFail(error))
        })  
    };
};

export const myFanficsUpdates = (userEmail,limit,daysLimit) =>{
    console.log('[actions: fandom.js] - myFanficsUpdates')
    return dispatch =>{
        dispatch(getUpdatesStart());
        return axios.get(`/updates/myFanficsUpdate?userEmail=${userEmail}&limit=${limit}&daysLimit=${daysLimit}`)
        .then(myLatestActivities =>{
            dispatch(getMyFanficsUpdatesSuccess(myLatestActivities.data));
            return true;
        })
        .catch(error =>{
            dispatch(getUpdatesFail(error))
        })  
    };
}