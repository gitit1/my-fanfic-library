const mongoose = require('../../../../config/mongoose');
const FanficSchema = require('../../../../models/Fanfic');
const FandomModal = require('../../../../models/Fandom');

exports.getFanficByID = async (fandomName, fanficID) => {
    console.log('getFanficByID');
    const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
    const collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandomName;

    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema, collectionName);
    return new Promise(function (resolve, reject) {
        FanficDB.find({ 'FanficID': fanficID, 'FandomName': fandomName }).exec(async function (err, fanficResult) {
            if (fanficResult && fanficResult.length !== 0) {
                resolve(fanficResult)
            } else {
                resolve(false)
            }
        });
    })
}