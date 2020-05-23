
const mongoose = require('../../../../config/mongoose');
const FanficSchema = require('../../../../models/Fanfic');
const FandomModal = require('../../../../models/Fandom');

exports.checkForSimilar = async (fanfic,fandomName) =>{
    console.log('checkForSimilar');
    const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
    const collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandomName;

    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,collectionName);
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

exports.checkForExactSimilar = async (fanfic,fandomName) =>{
    console.log('checkForExactSimilar');
    const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
    const collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandomName;

    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,collectionName);
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