
const clc = require("cli-color");
const FandomModal = require('../../../../models/Fandom');
const mongoose = require('../../../../config/mongoose');

exports.updateFandomFanficsNumbers = (fandom, source) => {
    console.log(clc.blue('[Downloader Helpers] updateFandomFanficsNumbers()'));
    const { FandomName, Collection } = fandom;
    return new Promise(async function (resolve, reject) {
        const collectionName = (Collection && Collection !== '') ? Collection : FandomName;

        fanficsInFandom = await mongoose.dbFanfics.collection(collectionName).countDocuments({'FandomName': FandomName});
        const sourceTotalFanficsInFandom = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'FandomName': FandomName });
        const sourceFanficsInSite = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'FandomName': FandomName, 'Deleted': false });
        const sourceCompleteFanfics = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'Complete': true, 'FandomName': FandomName, 'Deleted': false });
        const sourceDeletedFanfics = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'Deleted': true, 'FandomName': FandomName });
        const sourceSavedFanfics = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'SavedFic': true, 'FandomName': FandomName });
        const sourceOnGoingFanfics = sourceFanficsInSite - sourceCompleteFanfics;
        
        console.log(`${FandomName} - fanficsInFandom:`,fanficsInFandom)
        console.log(`${source} - TotalFanficsInFandom:`,sourceTotalFanficsInFandom)
        console.log(`${source} - FanficsInSite:`,sourceFanficsInSite)
        console.log(`${source} - CompleteFanfics:`,sourceCompleteFanfics)
        console.log(`${source} - SavedFanfics:`,sourceSavedFanfics)
        console.log(`${source} - DeletedFanfics:`,sourceDeletedFanfics)
        console.log(`${source} - OnGoingFanfics:`,sourceOnGoingFanfics)

        const attrTotalFanficsInFandom = `${source}.TotalFanficsInFandom`;
        const attrFanficsInSite = `${source}.FanficsInSite`;
        const attrCompleteFanfics = `${source}.CompleteFanfics`;
        const attrDeletedFanfics = `${source}.DeletedFanfics`;
        const attrSavedFanfics = `${source}.SavedFanfics`;
        const attrOnGoingFanfics = `${source}.OnGoingFanfics`;


        await FandomModal.updateOne({ 'FandomName': FandomName },
            {
                $set: {
                    'FanficsInFandom': fanficsInFandom,
                    [attrTotalFanficsInFandom]: sourceTotalFanficsInFandom,
                    [attrFanficsInSite]: sourceFanficsInSite,
                    [attrCompleteFanfics]: sourceCompleteFanfics,
                    [attrOnGoingFanfics]: sourceOnGoingFanfics,
                    [attrDeletedFanfics]: sourceDeletedFanfics,
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
        resolve(fanficsInFandom)
    }).catch((error) => {
        return false;
    });
}