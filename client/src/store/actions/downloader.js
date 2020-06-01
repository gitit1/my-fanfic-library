import * as actionTypes from './actionTypes';
import axios from '../axios-server';

const isDev = (process.env.NODE_ENV === 'development');

export const downloaderStart = () => { return { type: actionTypes.DOWNLOADER_START } };
export const downloaderFail = (error) => { return { type: actionTypes.DOWNLOADER_FAIL, error: error }; };
export const downloaderSuccess = () => { return { type: actionTypes.DOWNLOAD_FANFIC_DATA_SUCCESS } };

export const getFanficDataSuccess = (fanficData) => {
    return {
        type: actionTypes.GET_FANFIC_DATA_SUCCESS,
        fanfic: fanficData ? fanficData[0] : null,
        similarFanfic: fanficData[1] ? fanficData[1] : null
    };
};

export const backupDB = () => {
    isDev && console.log('[actions: fandom.js] - backupDB')
    
    return dispatch => {
        dispatch(downloaderStart())
        return axios.get(`/db/backupDB`)
            .then(() => {
                dispatch(downloaderSuccess())
                return true;
            })
            .catch(error => {
                dispatch(downloaderFail(error))
            })
    };
}

export const getFanficDataFromFile = (fandomName, fileName, fileType, file, deleted) =>{
    isDev && console.log('[actions: fandom.js] - getFanficDataFromFile')

    return dispatch => {
        dispatch(downloaderStart())
        return axios.post(`/downloader/getFanficDataFromFile?fandomName=${fandomName.replace("&","%26")}&fileName=${fileName}&filetype=${fileType}&isDeleted=${deleted}`,file)
        .then(fetchedData =>{
            if(!fetchedData.data){
                return 'wrong file';
            }
            dispatch(getFanficDataSuccess(fetchedData.data)).then(()=>{ return true });
        })
        .catch(error =>{
            dispatch(downloaderFail(error))
        })  
    };
};

export const getFanficData = (type, fandomName, id, fanficData) => {
    isDev && console.log('[actions: downloader] - getFanficData');
    fandomName = fandomName.replace("&","%26");

    return dispatch => {
        dispatch(downloaderStart())
        if (type === 'automatic') {
            return axios.get(`/downloader/getFanficData?type=${type}&url=${id}&fandomName=${fandomName}`)
                .then(fetchedData => {
                    dispatch(getFanficDataSuccess(fetchedData.data)).then(() => { return true });
                })
                .catch(error => {
                    dispatch(downloaderFail(error))
                })
        } else if (type === 'manually') {
            return axios.post(`/downloader/getFanficData?type=${type}&fandomName=${fandomName}`, fanficData)
                .then(fetchedData => {
                    dispatch(getFanficDataSuccess(fetchedData.data)).then(() => { return true });
                })
                .catch(error => {
                    dispatch(downloaderFail(error))
                })
        } else {
            return axios.get(`/downloader/getFanficData?type=${type}&fanficID=${id}&fandomName=${fandomName}`)
                .then(fetchedData => {
                    return fetchedData.data[0]
                })
                .catch(error => {
                    dispatch(downloaderFail(error))
                })
        }

    };
};

export const saveFanficFromFile = (fandomName, fileName, formData) => {
    isDev && console.log('[actions: fandom.js] - saveFanficFromFile');
    fandomName = fandomName.replace("&","%26");
    return dispatch => {
        dispatch(downloaderStart())
        return axios.post(`/downloader/saveFanficFromFile?fandomName=${fandomName}&fileName=${fileName}`, formData)
            .then(() => {
                dispatch(downloaderSuccess())
                return true;
            })
            .catch(error => {
                dispatch(downloaderFail(error))
            })
    };
}

export const saveDataOfFanficToDB = (fandomName, fanfic, download, url, image) => {
    isDev && console.log('[actions: downloader] - saveDataOfFanficToDB')
    image = null;
    fandomName = fandomName.replace("&","%26");
    return dispatch => {
        dispatch(downloaderStart())
        return axios.post(`/downloader/saveNewFanfic?url=${url}&fandomName=${fandomName}&download=${download}&image=${image}`, fanfic)
            .then(() => {
                dispatch(downloaderSuccess())
                return true;
            })
            .catch(error => {
                dispatch(downloaderFail(error))
            })
    };
};

export const updateFanficData = (fandomName, fanfic) => {
    isDev && console.log('[actions: downloader] - updateFanficData')
    fandomName = fandomName.replace("&","%26");
    return dispatch => {
        dispatch(downloaderStart())
        return axios.post(`/downloader/updateExistFanfic?fandomName=${fandomName}`, fanfic)
            .then(res => {
                dispatch(downloaderSuccess())
                return true;
            })
            .catch(error => {
                dispatch(downloaderFail(error))
            })
    };
};

export const saveAsSimilarFanfic = (isSimilar, fandomName, id1, id2) => {
    isDev && console.log('[actions: downloader] - saveAsSimilarFanfic');
    fandomName = fandomName.replace("&","%26");
    return dispatch => {
        dispatch(downloaderStart())
        return axios.post(`/downloader/saveAsSimilarFanfic?isSimilar=${isSimilar}&fandomName=${fandomName}&fanfic1ID=${id1}&fanfic2ID=${id2}`)
            .then(() => {
                dispatch(downloaderSuccess())
                return true;
            })
            .catch(error => {
                dispatch(downloaderFail(error))
            })
    };
}