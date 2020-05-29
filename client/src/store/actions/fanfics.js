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
        readingListsNames: fetchedData[2],
        ignoredCount: fetchedData[3],
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

export const getFanficsFromDB = (fandomName,pageNumber,pageLimit,userEmail,list) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDB')
    let skip = (pageLimit*pageNumber)-pageLimit;

    return dispatch =>{
        dispatch(getFanficsFromDBStart())
        return axios.post(`/db/getFanfics?FandomName=${fandomName.replace("&","%26")}&skip=${skip}&limit=${pageLimit}&userEmail=${userEmail}&list=${list}`)
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
export const addFanficToUserMarks = (userEmail,fandomName,fanficId,author,fanficTitle,source,markType,mark) =>{
    return dispatch =>{
        return axios.post(`/db/addFanficToUserMarks?fandomName=${fandomName}&fanficId=${fanficId}&author=${author}&fanficTitle=${fanficTitle}&source=${source}&userEmail=${userEmail}&markType=${markType}&mark=${mark}`)
        .then(res =>{
            return true;
        })
        .catch(error =>{
            return false
        })  
    };
    
}

export const addFanficToUserStatus = (userEmail,fandomName,fanficId,author,fanficTitle,source,statusType,status,data) =>{
    let dateArg = data ? `&data=${data}` : '';

    return dispatch =>{
        return axios.post(`/db/addFanficToUserStatus?fandomName=${fandomName}&fanficId=${fanficId}&author=${author}&fanficTitle=${fanficTitle}&source=${source}&userEmail=${userEmail}&statusType=${statusType}&status=${status}${dateArg}`)
        .then(res =>{
            // dispatch(addFanficToUserFavoritesSuccess(fetchedFanfics.data));
            return true;
        })
        .catch(error =>{
            return false
            // dispatch(addFanficToUserFavoritesFail(error))
        });
    };

}

export const saveCategories = (fandomName,fanficId,categoriesArray) =>{
    console.log('[actions: fanfics.js] - saveCategories')
    return dispatch =>{
        return axios.post(`/db/saveCategories?fandomName=${fandomName}&fanficId=${fanficId}&categories=${categoriesArray}`)
        .then(res =>{
            // dispatch(addFanficToUserFavoritesSuccess(fetchedFanfics.data));
            return true;
        })
        .catch(error =>{
            return false
            // dispatch(addFanficToUserFavoritesFail(error))
        });   
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

export const saveReadingList = (userEmail,fandomName,fanficId,author,fanficTitle,source,name) =>{
    console.log('[actions: fanfics.js] - saveReadingList')
    return dispatch =>{
        return axios.post(`/db/saveReadingList?userEmail=${userEmail}&fandomName=${fandomName}&fanficId=${fanficId}&author=${author}&fanficTitle=${fanficTitle}&source=${source}&name=${name}`)
        .then(res =>{
            return res.data;
        })
        .catch(error =>{
            return error
        });   
    };    
}

export const deleteFanficFromReadingList = (userEmail,fandomName,fanficId,author,fanficTitle,source,name)=>{
    console.log('[actions: fanfics.js] - deleteFanficFromReadingList')
    return dispatch =>{
        return axios.post(`/db/deleteFanficFromReadingList?userEmail=${userEmail}&fandomName=${fandomName}&fanficId=${fanficId}&author=${author}&fanficTitle=${fanficTitle}&source=${source}&name=${name}`)
        .then(res =>{
            return res.data;
        })
        .catch(error =>{
            return error
        });   
    }; 
}

export const deleteReadingList = (userEmail,name) =>{
    console.log('[actions: fanfics.js] - deleteFanficFromReadingList')
    return dispatch =>{
        return axios.post(`/db/deleteReadingList?userEmail=${userEmail}&name=${name}`)
        .then(res =>{
            return res.data;
        })
        .catch(error =>{
            return error
        });   
    }; 
}

export const saveImageOfReadingList = (userEmail,name,image) =>{
    console.log('[actions: fandom.js] - saveImageOfReadingList')

    return dispatch =>{
        dispatch(getFanficsFromDBStart())
        return axios.post(`/db/saveImageOfReadingList?userEmail=${userEmail}&name=${name}`,image)
        .then(res =>{
            return res;
        })
        .catch(error =>{
            dispatch(getFanficsFromDBFail(error))
        })  
    };
}

export const deleteFanficFromDB = (fandomName,fanficId,source,complete,deleted)=>{
    console.log('[actions: fanfics.js] - saveReadingList')
    return dispatch =>{
        return axios.post(`/db/deleteFanfic?fandomName=${fandomName}&fanficId=${fanficId}&source=${source}&complete=${complete}&deleted=${deleted}`)
        .then(() =>{
            return true;
        })
        .catch(error =>{
            return error
        });   
    };      
}

export const getReadingListsFromDBSuccess = (fetchedData) =>{
    console.log('[actions: fanfics.js] - getFanficsFromDBSuccess')
    return{
        type: actionTypes.GET_READING_LISTS_SUCCESS,
        readingListsFull: fetchedData,
    };
};

export const getReadingList = (userEmail) =>{
    console.log('[actions: fanfics.js] - getReadingList')
    return dispatch =>{
        dispatch(getFanficsFromDBStart())
        return axios.post(`/db/getReadingList?userEmail=${userEmail}`)
        .then(fetchedData =>{
            dispatch(getReadingListsFromDBSuccess(fetchedData.data));
            return true;
        })
        .catch(error =>{
            dispatch(getFanficsFromDBFail(error))
            return error
        });   
    };    
}

export const saveImageOfFanfic = (fandomName,fanficId,image) =>{
    console.log('[actions: fandom.js] - addFandomToDB')

    return dispatch =>{
        dispatch(getFanficsFromDBStart())
        return axios.post(`/db/saveImageOfFanfic?fandomName=${fandomName}&fanficId=${fanficId}`,image)
        .then(res =>{
            return res;
        })
        .catch(error =>{
            dispatch(getFanficsFromDBFail(error))
        })  
    };
}