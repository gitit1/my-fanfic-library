
const FandomModal = require('../../../../models/Fandom');

const { saveFanficToServerHandler } = require('../helpers/saveFanficsToServer');
const { getUrlBodyFromAo3 } = require('../helpers/getUrlBodyFromAo3')

const funcs = require('../../helpers/index');

exports.ao3SaveFanfic = async (jar, fandomName, download, url, fanfic) => {

    let fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) {
        if (err) { throw err; }
    });

    return await new Promise(async function (resolve, reject) {
        if (download == 'true') {
            let urlBody = await getUrlBodyFromAo3(jar, url) //TODO: fix it 'epub'
            await saveFanficToServerHandler(jar, url, urlBody, fandomName, 'epub', 'epub').then(async fanficInfo => {
                if (Number(fanficInfo[0]) > 0) {
                    fanfic["SavedFic"] = true
                    fanfic["NeedToSaveFlag"] = false
                    fanfic["fileName"] = fanficInfo[1];
                    fanfic["savedAs"] = fanficInfo[2];
                    counter = 0
                } else {
                    fanfic["SavedFic"] = false
                    fanfic["NeedToSaveFlag"] = true
                }

                funcs.saveFanficToDB(fandomName, fanfic, fandomData[0].Collection).then(async () => {
                    await funcs.updateFandomDataInDB(fanfic);
                    resolve()
                }).catch(error => {
                    console.log('error:::', error)
                    reject()
                })
            })
        } else {
            fanfic["SavedFic"] = false
            fanfic["NeedToSaveFlag"] = true
            funcs.saveFanficToDB(fandomName, fanfic, fandomData[0].Collection).then(async () => {
                await funcs.updateFandomDataInDB(fanfic);
                resolve()
            }).catch(error => {
                console.log('error:::', error)
                reject()
            })
        }
    });

}