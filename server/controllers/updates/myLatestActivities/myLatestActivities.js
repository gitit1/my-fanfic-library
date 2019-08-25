
const UserActivitiesDB = require('../../../models/UserActivities');


exports.myLatestActivities = async (limit,userEmail) =>{ 
    return new Promise(function(resolve, reject) {
        limit = Number(limit);
        UserActivitiesDB.find({"userEmail": userEmail}).limit(limit).exec(async function(err, fanfics) {
            err && reject(err)
            resolve(fanfics)
        })
    })
}
