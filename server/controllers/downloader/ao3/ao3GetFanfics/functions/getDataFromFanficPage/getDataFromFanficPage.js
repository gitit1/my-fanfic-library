const clc = require("cli-color");

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});

const {getDataFromPage} = require('./functions/getDataFromPage');
const {getPublishDate} = require('./functions/getPublishDate');
const {checkIfFanficIsNewOrUpdated} = require('./functions/checkIfFanficIsNewOrUpdated');
const {saveFanficToServerHandler} = require('../../../helpers/saveFanficsToServer');
const {saveFanficToDB} = require('../../../../helpers/saveFanficToDB');

exports.getDataFromFanficPage = async (page,fandomName,savedFanficsLastUpdate,autoSave,saveMethod,savedNotAuto) =>{
    //console.log(clc.blueBright('[ao3 controller] getDataFromPage()'));  
    let counter = -1;
        
    let fanfic = await getDataFromPage(page,fandomName);

    let check = await checkIfFanficIsNewOrUpdated(fanfic);
    let newFic=check[0],updated=check[1];
    fanfic = check[2];

    console.log('URL:',fanfic.URL)

    if(savedFanficsLastUpdate===undefined || newFic){
        fanfic["PublishDate"] =  await getPublishDate(fanfic["URL"])
    }


    if((newFic || updated || savedFanficsLastUpdate===undefined) && autoSave){
    
        return await saveFanficToServerHandler(fanfic["URL"],fandomName,saveMethod,savedNotAuto).then(async fanficInfo=>{

            if(Number(fanficInfo[0])>0){
                fanfic["SavedFic"]   =   true
                fanfic["NeedToSaveFlag"] = false
                fanfic["fileName"] = fanficInfo[1];
                fanfic["savedAs"] =  fanficInfo[2];
                counter = 0
            }else{
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
        return saveFanficToDB(fandomName,fanfic).then(async () =>{
            return counter  
        }).catch(error=>{
            console.log('error:::',error)
            return error
        }) 
    } 
}