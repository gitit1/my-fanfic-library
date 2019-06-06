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

// export const fandomInit = () =>{
//     return{
//         type: actionTypes.FANDOM_INIT
//     };
// }

export const addFandomToDBStart = () =>{
    return{
        type: actionTypes.ADD_FANDOM_START
    };
};

export const addFandomToDBSuccess = (message) =>{
    return{
        type: actionTypes.ADD_FANDOM_SUCCESS,
        message: message
    };
};

export const addFandomToDBFail = (error) =>{
    return{
        type: actionTypes.ADD_FANDOM_FAIL,
        error: error
    };
};

export const addFandomToDB = (fandom_Name,fandom) =>{
    return dispatch =>{
        dispatch(addFandomToDBStart())
        return axios.post(`/db/addFandom?Fandom_Name=${fandom_Name}`, 
                  fandom ,
                  {headers: {'Content-Type': 'multipart/form-data',"Access-Control-Allow-Origin": "*"} 
        }).then(res =>{
            dispatch(addFandomToDBSuccess(res.data));
            return true;
        })
        .catch(error =>{
            dispatch(addFandomToDBFail(error))
        })  
    };
};
