const {getAllFandoms}  =  require("../db/CRUD/Fandoms/getAllFandomsFromDB");

exports.fetchFandoms = () =>{
    return new Promise(async function(resolve, reject) {
        getAllFandoms().then(fetchedFandoms=>{
            if(!fetchedFandoms){
                reject(false)
            }else{
                resolve(fetchedFandoms)
            }
        })
    });
};