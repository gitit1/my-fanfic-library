
const clc = require("cli-color");
const FandomModal = require('../../../../models/Fandom');
const mongoose = require('../../../../config/mongoose');

exports.updateFandomFanficsNumbers = (fandom, source) => {
    console.log(clc.blue('[Downloader Helpers] updateFandomFanficsNumbers()'));
    const { FandomName, Collection } = fandom;
    return new Promise(async function (resolve, reject) {
        const collectionName = (Collection && Collection !== '') ? Collection : FandomName;

        fanficsInFandom = await mongoose.dbFanfics.collection(collectionName).countDocuments({'FandomName': FandomName});
        const sourceFanficsInFandom = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'FandomName': FandomName, 'Deleted': false });
        const sourceCompleteFanfics = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'Complete': true, 'FandomName': FandomName, 'Deleted': false });
        const sourceSavedFanfics = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'SavedFic': true, 'FandomName': FandomName, 'Deleted': false });
        const sourceOnGoingFanfics = sourceFanficsInFandom - sourceCompleteFanfics;
        
        console.log(`${FandomName} - fanficsInFandom:`,fanficsInFandom)
        console.log(`${source} - FanficsInFandom:`,sourceFanficsInFandom)
        console.log(`${source} - CompleteFanfics:`,sourceCompleteFanfics)
        console.log(`${source} - SavedFanfics:`,sourceSavedFanfics)
        console.log(`${source} - OnGoingFanfics:`,sourceOnGoingFanfics)

        const attrFanficsInFandom = `${source}.FanficsInFandom`;
        const attrCompleteFanfics = `${source}.CompleteFanfics`;
        const attrSavedFanfics = `${source}.SavedFanfics`;
        const attrOnGoingFanfics = `${source}.OnGoingFanfics`;


        await FandomModal.updateOne({ 'FandomName': FandomName },
            {
                $set: {
                    'FanficsInFandom': fanficsInFandom,
                    [attrFanficsInFandom]: sourceFanficsInFandom,
                    [attrCompleteFanfics]: sourceCompleteFanfics,
                    [attrOnGoingFanfics]: sourceOnGoingFanfics,
                    [attrSavedFanfics]: sourceSavedFanfics,
                    'LastUpdate': new Date().getTime(),
                    'FanficsLastUpdate': new Date().getTime(),
                    'SavedFanficsLastUpdate': new Date().getTime()
                }
            },
            (err, result) => {
                if (err) throw err;

            }
        );
        resolve()
    }).catch((error) => {
        return false;
    });
}