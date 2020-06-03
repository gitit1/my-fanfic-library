const clc = require("cli-color");

const { getDataFromPage } = require('./functions/getDataFromPage');
const { getPublishDate } = require('./functions/getPublishDate');
const { checkIfFanficIsNewOrUpdated } = require('./functions/checkIfFanficIsNewOrUpdated');
const { saveFanficToServerHandler } = require('../../../helpers/saveFanficsToServer');
const { getUrlBodyFromAo3 } = require('../../../helpers/getUrlBodyFromAo3');

const funcs = require('../../../../helpers/index');

exports.getDataFromFanficPage = async (jar, log, page, fandom) => {
    //console.log(clc.blueBright('[ao3 controller] getDataFromPage()')); 
    const { FandomName, AutoSave, SaveMethod, Collection, SavedFanficsLastUpdate } = fandom;
    let fanfic = await getDataFromPage(page, FandomName);
    console.log(`-----${fanfic["FanficTitle"]}------`)
    log.info(`-----FanficID: ${fanfic.FanficID}`);

    let check = await checkIfFanficIsNewOrUpdated(log, FandomName, fanfic, Collection);
    console.log(`newFic: ${check[0]},updated: ${check[1]}`)
    let newFic = check[0], updated = check[1];
    fanfic = check[2];

    pageUrl = 'https://archiveofourown.org' + page.find('div.header h4 a').first().attr('href') + '?view_adult=true';
    let counter = -1;

    if ((newFic || updated || SavedFanficsLastUpdate === undefined) && AutoSave) {

        return await getUrlBodyFromAo3(jar, pageUrl, log).then(async urlBody => {
            if (newFic || fanfic["PublishDate"] === 0) {
                fanfic["PublishDate"] = await getPublishDate(urlBody)
            }

            await saveFanficToServerHandler(jar, fanfic['URL'], urlBody, FandomName, SaveMethod).then(async fanficInfo => {

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

                return funcs.saveFanficToDB(FandomName, fanfic, Collection).then(async () => {
                    return counter
                }).catch(error => {
                    console.log('error:::', error);
                    console.log(`------------------`)
                    return counter
                })
            })

        });
    } else {
        return funcs.saveFanficToDB(FandomName, fanfic, Collection).then(async () => {
            console.log(`------------------`)
            return counter
        }).catch(error => {
            console.log('error:::', error)
            return error
        })
    }

    // });
}