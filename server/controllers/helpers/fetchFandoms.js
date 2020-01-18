const db  =  require("../db/db.js");

exports.fetchFandoms = () =>{
    return new Promise(async function(resolve, reject) {
        db.getAllFandoms().then(fetchedFandoms=>{
            if(!fetchedFandoms){
                reject(false)
            }else{
                resolve(fetchedFandoms)
            }
        })
    });
};