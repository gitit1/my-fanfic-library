const pLimit = require('p-limit');
const mongoose = require('../../../../config/mongoose');
const {checkIfGotUpdated} = require('./functions/checkIfGotUpdated')

exports.ffGetFanfics = async (fandom) =>{     
    return new Promise(async function(resolve, reject) {
        await mongoose.dbFanfics.collection(fandom.FandomName).find({Source: 'FF'}).toArray(async function(err, dbFanfic) {
            const promises=[],limit = pLimit(1),length=dbFanfic.length;

            for (let i = 0; i < dbFanfic.length; i++) {
                // await promises.push(limit(res => func.delay(7000).then(async res => {checkIfGotUpdated(fandom.AutoSave,dbFanfic[i])})))
                promises.push(limit(() => checkIfGotUpdated(fandom.AutoSave, dbFanfic[i])))
            }

            await Promise.all(promises).then(async results=> {
                savedFanfics = results.reduce((a, b) => a + b, 0)        
            }).then(()=>resolve([length,savedFanfics]))
            
        });
    });
}
