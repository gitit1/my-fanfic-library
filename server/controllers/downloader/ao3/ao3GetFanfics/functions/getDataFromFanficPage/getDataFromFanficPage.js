const clc = require("cli-color");

const {getDataFromPage} = require('./functions/getDataFromPage');
const {getPublishDate} = require('./functions/getPublishDate');
const {checkIfFanficIsNewOrUpdated} = require('./functions/checkIfFanficIsNewOrUpdated');
const {saveFanficToServerHandler} = require('../../../helpers/saveFanficsToServer');
const {saveFanficToDB} = require('../../../../helpers/saveFanficToDB');

exports.getDataFromFanficPage = async (jar, log, page, fandomName, savedFanficsLastUpdate, autoSave, saveMethod, savedNotAuto) =>{
    //console.log(clc.blueBright('[ao3 controller] getDataFromPage()'));   
    let counter = -1;
        
    let fanfic = await getDataFromPage(page,fandomName);
    log.info(`-----FanficID: ${fanfic.FanficID}`);
    // let check = (savedFanficsLastUpdate!==undefined) ? await checkIfFanficIsNewOrUpdated(log, fandomName,fanfic,autoSave) : [false,false,fanfic];
    let check = await checkIfFanficIsNewOrUpdated(log, fandomName,fanfic,autoSave);
    console.log(`newFic: ${check[0]},updated: ${check[1]}`)
    let newFic=check[0],updated=check[1];
    fanfic = check[2];

    if(newFic || fanfic["PublishDate"]===0){
        fanfic["PublishDate"] =  await getPublishDate(jar,fanfic["URL"])
    }

    if((newFic || updated || savedNotAuto) && autoSave){
    // if((newFic || updated || savedFanficsLastUpdate===undefined) && autoSave){
    
        return await saveFanficToServerHandler(jar, fanfic["URL"], fandomName, saveMethod, savedNotAuto).then(async fanficInfo=>{

            if(Number(fanficInfo[0])>0){
                fanfic["SavedFic"]   =   true
                fanfic["NeedToSaveFlag"] = false
                fanfic["fileName"] = fanficInfo[1];
                fanfic["savedAs"] =  fanficInfo[2];
                counter = 0
            }else{
                console.log("--didn't managed to save file will try next full run")
                fanfic["SavedFic"]   =   false
                fanfic["NeedToSaveFlag"] = true               
            }

            return saveFanficToDB(fandomName,fanfic).then(async () =>{
                return counter  
            }).catch(error=>{
                console.log('error:::',error)
                return counter
            })
        })
    }else{
        fanfic["NeedToSaveFlag"] = false;
        fanfic["SavedFic"]   =   false;
        return saveFanficToDB(fandomName,fanfic).then(async () =>{
            return counter  
        }).catch(error=>{
            console.log('error:::',error)
            return error
        }) 
    } 
}