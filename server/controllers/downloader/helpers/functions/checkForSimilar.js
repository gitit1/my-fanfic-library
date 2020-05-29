
const mongoose = require('../../../../config/mongoose');
const FanficSchema = require('../../../../models/Fanfic');
const FandomModal = require('../../../../models/Fandom');

exports.checkForSimilar = async (fanfic, fandomName, collection) => {
    console.log('checkForSimilar');
    let collectionName;

    if(!collection){
        const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
        collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandomName;
    } else {
        collectionName = collection;
    }

    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema, collectionName);
    return new Promise(function (resolve, reject) {
        FanficDB.find({ 'FanficID': fanfic.FanficID }).exec(async function (err, fanficResult) {
            if (fanficResult && fanficResult.length !== 0) {
                resolve(fanficResult)
            } else {
                FanficDB.find({ $or: [{ 'FanficTitle': { $regex: `.*${fanfic.FanficTitle}.*`, '$options': 'i' } }, { 'Author': { $regex: `.*${fanfic.Author}.*`, '$options': 'i' } }] }).exec(async function (err, fanficResult) {
                    err && reject(err)
                    if (fanficResult === undefined || fanficResult.length === 0) {
                        resolve(false)
                    } else {
                        resolve(fanficResult)
                    }
                });
            }
        });
    })
}

exports.checkForExactSimilar = async (fanfic, fandomName, collection) => {
    return await checkForExactSimilarFunc(fanfic, fandomName, collection)

}

const checkForExactSimilarFunc = async (fanfic, fandomName, collection) => {
    console.log('checkForExactSimilar');
    let fanficTitle = fanfic.FanficTitle, collectionName;

    if (fanficTitle.includes('(') && !fanficTitle.includes(')')) {
        fanficTitle = fanficTitle.replace(/\(/g, "");
    } else if (fanficTitle.includes(')') && !fanficTitle.includes('(')) {
        fanficTitle = fanficTitle.replace(/\)/g, "");
    }

    if(!collection){
        const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
        collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandomName;
    } else {
        collectionName = collection;
    }

    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema, collectionName);
    return new Promise(function (resolve, reject) {
        FanficDB.find({ 'FanficID': fanfic.FanficID }).exec(async function (err, fanficResult) {
            if (fanficResult && fanficResult.length !== 0) {
                resolve(fanficResult)
            } else {
                FanficDB.find({ $and: [{ 'FanficTitle': { $regex: `.*${fanficTitle}.*`, '$options': 'i' } }, { 'Author': { $regex: `.*${fanfic.Author}.*`, '$options': 'i' } }] }).exec(async function (err, fanficResult) {
                    err && reject(err)
                    if (fanficResult === undefined || fanficResult.length === 0) {
                        resolve(false)
                    } else {
                        resolve(fanficResult)
                    }
                });
            }
        });
    })
}

exports.checkForSimilarForMergeWithFF = async (fanfic, fandomName, collection) => {
    console.log('checkForSimilarForMergeWithFF');
    let collectionName;

    if(!collection){
        const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
        collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandomName;
    } else {
        collectionName = collection;
    }

    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema, collectionName);
    return new Promise(function (resolve, reject) {
        FanficDB.find({ 'SimilarCheck': fanfic.FanficID }).exec(async function (err, fanficResult) {
            if (fanficResult && fanficResult.length !== 0) {
                resolve(fanficResult)
            } else {
                let result = checkForExactSimilarFunc(fanfic, fandomName, collection);
                resolve(result)
            }
        });
    })
}