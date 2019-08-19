const mongoose = require('../../../config/mongoose');
const func = require('../../../helpers/functions');

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});


exports.saveFanficToDB = (fandomName,fanfic) =>{
    // console.log(clc.bgGreenBright('[ao3 controller] saveFanfficToDB()',fandomName));   
    return new Promise(async function(resolve, reject) {
        mongoose.dbFanfics.collection(fandomName).findOne({FanficID: fanfic["FanficID"] }, async function(err, dbFanfic) {
            if (err) { 
                func.delay(1000).then(async () => reject(false))
                return reject()
            }
            let isExist = (dbFanfic===null) ? false : true;
            if(!isExist){
                mongoose.dbFanfics.collection(fandomName).insertOne(fanfic, async function (error, response) {
                    await func.delay(1000).then(() => resolve(true))
                });
                
            }else{ 
                mongoose.dbFanfics.collection(fandomName).updateOne({ 'FanficID': fanfic["FanficID"]},{$set: fanfic}, async function (error, response) {
                    await func.delay(1000).then(() => resolve(true))
                })
            }
        });
    });
}