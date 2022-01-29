const FandomModal = require('../../../../../models/Fandom');
const { getDataFromPage } = require('../../helpers/getDataFromPage');
const { fixStringForPath } = require('../../../../helpers/fixStringForPath.js');
const funcs = require('../../../helpers/index');

exports.checkIfGotUpdated = (autoSave, fanfic) => {
    return funcs.delay(7000).then(() => {
        return new Promise(function (resolve, reject) {
            const oldData = fanfic;
            console.log('fanficName',fanfic.FanficTitle)
            if(fanfic.Deleted || fanfic.Complete){resolve(true)};
            getDataFromPage(fanfic.URL,fanfic.FandomName).then(async newData=>{
                const updated = (
                    (newData.NumberOfChapters > oldData.NumberOfChapters) ||
                    (newData.LastUpdateOfFic > oldData.LastUpdateOfFic) ||
                    (newData.FanficTitle !== oldData.FanficTitle) ||
                    (newData.Author !== oldData.Author)) ? true : false;
                if (updated) {
                    newData.NeedToSaveFlag = true;
                    newData.Status = 'updated';
                    newData.StatusDetails =
                        (newData.Complete !== oldData.Complete) ? 'completed' :
                            (newData.NumberOfChapters > oldData.NumberOfChapters) ? 'chapter' :
                                (newData.Author !== oldData.Author) ? 'author' :
                                    (newData.FanficTitle !== oldData.FanficTitle) ? 'title' : 'old';
                } else {
                    newData.NeedToSaveFlag = false;
                    newData.Status = 'old';
                    newData.StatusDetails = 'old';
                }
                newData.SavedFic = oldData.SavedFic;
                newData.fileName = fixStringForPath(oldData.fileName);
                newData.savedAs = oldData.savedAs;

                let fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });

                await funcs.saveFanficToDB(fanfic.FandomName, newData, fandomData[0].Collection).then(async res => {
                    const { URL, Source, fileName, savedAs, FandomName, FanficID } = newData;
                    // updated && autoSave && await funcs.downloadFanfic(URL, Source, fileName, savedAs, FandomName, FanficID);
                    updated && autoSave && await funcs.downloadFFFanficNew(FandomName, FanficID, fileName) 
                    !res ? reject() : (updated && autoSave) ? resolve(true) : resolve(false)
                });
            })
        });
    })
}
