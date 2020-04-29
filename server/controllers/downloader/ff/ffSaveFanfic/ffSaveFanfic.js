
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

const funcs = require('../../helpers/index');

exports.ffSaveFanfic = async (fandomName,download,url,fanfic) =>{ 
    return await new Promise(async function(resolve, reject) {  
        const {Source, Author, FanficTitle, FanficID} = fanfic;
        const status = await funcs.saveFanficToDB(fandomName,fanfic);
        status && await funcs.updateFandomDataInDB(fanfic);
        download=='true' && await funcs.downloadFanfic(url, Source, `${Author}_${FanficTitle} (${FanficID})`, 'epub', fandomName, FanficID)     
        // download=='true' && await downloadFanfic(url, Source, `${Author}_${FanficTitle} (${FanficID})`, 'pdf', fandomName, FanficID)     
        resolve();
    });
}