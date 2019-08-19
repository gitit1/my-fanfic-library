
const mongoose = require('../../../../../config/mongoose');
const FanficSchema = require('../../../../../models/Fanfic');

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});

exports.checkForSimilar = (fanfic,fandomName) =>{
    console.log('checkForSimilar')
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    return new Promise(function(resolve, reject) {
        FanficDB.find({'FanficID':fanfic.FanficID}).exec(async function(err, fanficResult) {
            if(fanficResult.length!==0){
                resolve(fanficResult)
            }else{
                FanficDB.find({'FanficTitle': {$regex : `.*${fanfic.FanficTitle}.*`, '$options' : 'i'},'FanficTitle': {$regex : `.*${fanfic.FanficTitle}.*`, '$options' : 'i'}}).exec(async function(err, fanficResult) {
                    err && reject(err)
                    if(fanficResult.length===0){
                        resolve(false)
                    }else{
                        resolve(fanficResult)
                    }
                });
            }
        });
    })
}