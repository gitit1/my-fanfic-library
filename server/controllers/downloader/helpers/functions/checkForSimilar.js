
const mongoose = require('../../../../config/mongoose');
const FanficSchema = require('../../../../models/Fanfic');

exports.checkForSimilar = (fanfic,fandomName) =>{
    console.log('checkForSimilar')
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    return new Promise(function(resolve, reject) {
        FanficDB.find({'FanficID':fanfic.FanficID}).exec(async function(err, fanficResult) {
            if(fanficResult&&fanficResult.length!==0){
                resolve(fanficResult)
            }else{
                FanficDB.find({$or: [{'FanficTitle': {$regex : `.*${fanfic.FanficTitle}.*`, '$options' : 'i'}},{'Author': {$regex : `.*${fanfic.Author}.*`, '$options' : 'i'}}]}).exec(async function(err, fanficResult) {
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

exports.checkForExactSimilar = (fanfic,fandomName) =>{
    console.log('checkForExactSimilar')
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    return new Promise(function(resolve, reject) {
        FanficDB.find({'FanficID':fanfic.FanficID}).exec(async function(err, fanficResult) {
            if(fanficResult&&fanficResult.length!==0){
                resolve(fanficResult)
            }else{
                FanficDB.find({$and: [{'FanficTitle': {$regex : `.*${fanfic.FanficTitle}.*`, '$options' : 'i'}},{'Author': {$regex : `.*${fanfic.Author}.*`, '$options' : 'i'}}]}).exec(async function(err, fanficResult) {
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