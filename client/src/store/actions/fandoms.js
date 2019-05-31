import * as actionTypes from './actionTypes';
import axios from 'axios';

export const fandomInit = () =>{
    return{
        type: actionTypes.FANDOM_INIT
    };
}

export const getFandomsFromDBSuccess = (fandoms) =>{
    return{
        type: actionTypes.FANDOMS_SUCCESS,
        fandoms: fandoms
    };
};

export const getFandomsFromDBFail = (error) =>{
    return{
        type: actionTypes.FANDOMS_FAIL,
        error: error
    };
};

export const getFandomsFromDBStart = () =>{
    return{
        type: actionTypes.FANDOMS_START
    };
};

export const getFandomsFromDB = () =>{
    return dispatch =>{
        dispatch(getFandomsFromDBStart())
        axios.get('/db/getAllFandoms')
        .then(res =>{
            const fetchedFandoms= []
            for(let key in res.data){
                fetchedFandoms.push({...res.data[key],id: key});
            }
            dispatch(getFandomsFromDBSuccess(fetchedFandoms))
        })
        .catch(error =>{
            dispatch(getFandomsFromDBFail(error))
        })  
    };
};