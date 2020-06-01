import * as actionTypes from './actionTypes';
import axios from '../axios-server';

const isDev = (process.env.NODE_ENV === 'development');


export const getUpdatesStart = () => {
    isDev && console.log('[actions: updates.js] - getUpdatesStart')
    return {
        type: actionTypes.GET_UPDATES_START
    };
};

export const getUpdatesFail = (error) => {
    isDev && console.log('[actions: updates.js] - getUpdatesFail')
    return {
        type: actionTypes.GET_UPDATES_FAIL,
        error: error
    };
};

export const getLatestUpdatesSuccess = (latestUpdates) => {
    isDev && console.log('[actions: updates.js] - getLatestUpdatesSuccess')
    return { type: actionTypes.GET_LATEST_UPDATES_SUCCESS, latestUpdates };
};

export const getMyLatestActivitiesSuccess = (myLatestActivities) => {
    isDev && console.log('[actions: updates.js] - getMyLatestActivitiesSuccess')
    return { type: actionTypes.GET_MY_LATEST_ACTIVITIES_SUCCESS, myLatestActivities: myLatestActivities };
};

export const getMyFanficsUpdatesSuccess = (myFanficsUpdates) => {
    isDev && console.log('[actions: updates.js] - getMyLatestActivitiesSuccess')
    return { type: actionTypes.GET_MY_FANFICS_UPDATES_SUCCESS, myFanficsUpdates: myFanficsUpdates };
};

export const getLatestUpdates = (limit) => {
    isDev && console.log('[actions: updates.js] - getLatestUpdates')
    return dispatch => {
        dispatch(getUpdatesStart())
        return axios.get(`/updates/latestUpdates?limit=${limit}`)
            .then(latestUpdates => {
                dispatch(getLatestUpdatesSuccess(latestUpdates.data));
                return true;
            })
            .catch(error => {
                dispatch(getUpdatesFail(error))
            })
    };
};

export const getMyLatestActivities = (limit, userEmail) => {
    isDev && console.log('[actions: updates.js] - getMyLatestActivities')
    return dispatch => {
        dispatch(getUpdatesStart());
        return axios.get(`/updates/myLatestActivities?userEmail=${userEmail}&limit=${limit}`)
            .then(myLatestActivities => {
                dispatch(getMyLatestActivitiesSuccess(myLatestActivities.data));
                return true;
            })
            .catch(error => {
                dispatch(getUpdatesFail(error))
            })
    };
};

export const myFanficsUpdates = (userEmail, limit, daysLimit) => {
    isDev && console.log('[actions: updates.js] - myFanficsUpdates')
    return dispatch => {
        dispatch(getUpdatesStart());
        return axios.get(`/updates/myFanficsUpdate?userEmail=${userEmail}&limit=${limit}&daysLimit=${daysLimit}`)
            .then(myLatestActivities => {
                dispatch(getMyFanficsUpdatesSuccess(myLatestActivities.data));
                return true;
            })
            .catch(error => {
                dispatch(getUpdatesFail(error))
            })
    };
}