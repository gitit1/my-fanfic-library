const clc = require("cli-color");

const { getDataFromPage } = require('./functions/getDataFromPage');
const { getPublishDate } = require('./functions/getPublishDate');
const { checkIfFanficIsNewOrUpdated } = require('./functions/checkIfFanficIsNewOrUpdated');
const { saveFanficToServerHandler } = require('../../../helpers/saveFanficsToServer');
const { getUrlBodyFromAo3 } = require('../../../helpers/getUrlBodyFromAo3');

const funcs = require('../../../../helpers/index');

exports.getDataFromFanficPage = async (jar, log, page, fandomName, autoSave, saveMethod, collection, savedNotAuto) => {
    //console.log(clc.blueBright('[ao3 controller] getDataFromPage()'));   
    pageUrl = 'https://archiveofourown.org' + page.find('div.header h4 a').first().attr('href') + '?view_adult=true';
    await getUrlBodyFromAo3(jar, pageUrl, log).then(async urlBody => {
        let fanfic = await getDataFromPage(page, fandomName);
        
        console.log(`-----${fanfic["FanficTitle"]}------`)
        log.info(`-----FanficID: ${fanfic.FanficID}`);

        let check = await checkIfFanficIsNewOrUpdated(log, fandomName, fanfic, autoSave);
        console.log(`newFic: ${check[0]},updated: ${check[1]}`)
        let newFic = check[0], updated = check[1];
        fanfic = check[2];

        // if (((newFic || updated || savedNotAuto) && autoSave) || fanfic["PublishDate"] === 0) {
            let counter = -1;

            if (newFic || fanfic["PublishDate"] === 0) {
                fanfic["PublishDate"] = await getPublishDate(urlBody)
            }

            if ((newFic || updated || savedNotAuto) && autoSave) {
                // if((newFic || updated || savedFanficsLastUpdate===undefined) && autoSave){

                return await saveFanficToServerHandler(jar, fanfic['URL'], urlBody, fandomName, saveMethod, savedNotAuto).then(async fanficInfo => {

                    if (Number(fanficInfo[0]) > 0) {
                        fanfic["SavedFic"] = true
                        fanfic["NeedToSaveFlag"] = false
                        fanfic["fileName"] = fanficInfo[1];
                        fanfic["savedAs"] = fanficInfo[2];
                        counter = 0
                    } else {
                        console.log("--didn't managed to save file will try next full run")
                        fanfic["SavedFic"] = false
                        fanfic["NeedToSaveFlag"] = true
                    }

                    return funcs.saveFanficToDB(fandomName, fanfic, collection).then(async () => {
                        return counter
                    }).catch(error => {
                        console.log('error:::', error);
                        console.log(`------------------`)
                        return counter
                    })
                })
            } else {
                fanfic["NeedToSaveFlag"] = false;
                fanfic["SavedFic"] = false;
                return funcs.saveFanficToDB(fandomName, fanfic, collection).then(async () => {
                    console.log(`------------------`)
                    return counter
                }).catch(error => {
                    console.log('error:::', error)
                    return error
                })
            }
        });
    // });
}