
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');
const { fixStringForPath } = require('../../../helpers/fixStringForPath')
const funcs = require('../../helpers/index');

exports.ffSaveFanfic = async (fandomName, download, url, fanfic) => {
    return await new Promise(async function (resolve, reject) {
        const { Source, Author, FanficTitle, FanficID, Collection } = fanfic;
        const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });

        const status = await funcs.saveFanficToDB(fandomName, fanfic, fandomData[0].Collection);
        status && await funcs.updateFandomDataInDB(fanfic);
        // download == 'true' && await funcs.downloadFanfic(url, Source, `${Author}_${FanficTitle} (${FanficID})`, 'epub', fandomName, FanficID, Collection)   
        download == 'true' && await funcs.downloadFFfanfic(fandomName, FanficID, `${Author}_${FanficTitle} (${FanficID})`) 
        resolve();
    });
}