const clc = require("cli-color");
const fs = require('fs');

const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');
const {saveFanficToServerHandler} = require('../helpers/saveFanficsToServer.js')
const {loginToAO3} = require('../helpers/loginToAO3.js')

const fanficsPath = "public/fandoms"

exports.ao3SaveMissingFanfics = async (jar,fandomName) =>{
    console.log(clc.bgGreenBright('[ao3 controller] checkIfFileExsistHandler()'));
    let sum = 0;

    await checkIfFileExsist(jar,fandomName).then(async sum=>{
        const savedFanficsAll = await mongoose.dbFanfics.collection(fandomName).countDocuments({'SavedFic':true});
        await FandomModal.updateOne({ 'FandomName': fandomName },
        { $set: {   'AO3.SavedFanfics':savedFanficsAll,
        'LastUpdate':new Date().getTime(),
        'FanficsLastUpdate':new Date().getTime(),
        'SavedFanficsLastUpdate':new Date().getTime()
    }},
    (err, result) => {
        if (err) throw err;
        
    }
    );
        console.log('sum1:',sum)
    })
    return sum
}

const checkIfFileExsist = async (jar,fandomName) => {
    let counter = 0,sum = 0;
    await loginToAO3();

    const checkIfExist = (fanfic,path,method) =>{
        const fanficId = fanfic.FanficID, fileName = fanfic.fileName, url = fanfic.URL;
        console.log('path: ',path)
        // console.log('fileName:',fileName)
        return new Promise(async function(resolve, reject) {
            if (fs.existsSync(path)) {
                resolve(0)
            }else{
                console.log(clc.red(`${path} is not exisisting... redownload it`))
                fanficInfo = await saveFanficToServerHandler(jar,url,fandomName,method,null)
                mongoose.dbFanfics.collection(fandomName).updateOne({FanficID: fanficId},
                                                                    {$set: {SavedFic:true,NeedToSaveFlag:false,fileName:fanficInfo[1],savedAs:fanficInfo[2]}}
                                                                    , async function (error, response) {
                    return resolve(1)
                })
  
            }
        })
    }

    return new Promise(async function(resolve, reject) {
        mongoose.dbFanfics.collection(fandomName).find({}).toArray(async function(err, dbFanfic) {
            
            for (let index = 0; index < dbFanfic.length; index++) {
                let methods=[],method = dbFanfic[index].savedAs;

                if (method===undefined){
                    await FandomModal.findOne({FandomName: fandomName},async function(err, fandom) {
                        (fandom.AutoSave && fandom.SaveMethod.includes(",")) ? methods.push(fandom.SaveMethod) : methods = fandom.SaveMethod.split(',')
                    })
                }else{(!method.includes(",")) ? methods.push(method) : methods = method.split(',');}

                if(dbFanfic[index].Deleted===undefined || (!dbFanfic[index].Deleted)){
                    await methods.map(async (method) => {
                        path = `${fanficsPath}/${fandomName.toLowerCase()}/fanfics/${dbFanfic[index].fileName}.${method}`;
                        counter = await checkIfExist(dbFanfic[index],path,method)                        
                        sum = sum+counter;
                    })
                }
            }
            console.log('sum: ',sum)
            resolve(sum)
        })
    })

}