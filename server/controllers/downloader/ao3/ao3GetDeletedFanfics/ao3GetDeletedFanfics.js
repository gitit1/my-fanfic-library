const clc = require("cli-color");
const cheerio = require('cheerio');
const mongoose = require('../../../../config/mongoose');
let request = require('request')
const pLimit = require('p-limit');

const FandomModal = require('../../../../models/Fandom');
const FanficSchema = require('../../../../models/Fanfic');
const func = require('../../helpers/generalFunctions');
const {loginToAO3} = require('../helpers/loginToAO3');

exports.ao3GetDeletedFanfics = async (jar,fandomName,fanficsSum) =>{   
    console.log(clc.bgGreenBright('[ao3 controller] checkIfDeletedFromAO3()'));
    request = request.defaults({jar: jar,followAllRedirects: true});
    await loginToAO3(jar)
    
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    let skip=0,limit=100,promises=[],promises2=[],gotDeletedArray = [],newDeletedCounter=0,allDeletedCounter=0;
    let loop = Math.ceil(fanficsSum/limit)
 

    const getFanficList = ()=>{
        return new Promise(function(resolve, reject) {
            FanficDB.find({Source:'AO3'}).sort({['LastUpdateOfFic']: -1 , ['LastUpdateOfNote']: 1}).exec(async function(err, fanfics) { 
                const limit = pLimit(50)
                for (let i = 0; i < fanfics.length; i++) {
                    await promises2.push(limit(() => checkIfDeleted(jar,fanfics[i])));
                }
                resolve();
            });
        });
    }
    const checkIfDeleted = (jar,fanfic) =>{

        let url = fanfic.URL;

        return new Promise(function(resolve, reject) {
            request.get({url,jar: jar,credentials: 'include'}, async function (err, httpResponse, body) {
                try {
                    func.delay(2000).then(async () => {
                        if(httpResponse===undefined || httpResponse.body===undefined){
                            reject(console.log(clc.red('Error in checkIfDeleted: body undefined: ',fanfic.FanficID,' url: ',fanfic.URL)))
                        }else{
                            // console.log('FanficID:',fanfic.FanficID)                           
                            let $ = cheerio.load(httpResponse.body);
                            if(err){
                                reject(console.log(clc.red('Error in checkIfDeleted: ',err)))
                            }else{
                                if($('#main h2').text().includes("Error 404") || $('#main div.error').text().includes("you don't have permission")){
                                    console.log(clc.redBright(`Deleted fanfic:: ${fanfic.FanficTitle}`))    
                                    gotDeletedArray.push(fanfic);
                                }
                                resolve();         
                            } 
                        }
                    })         
                }catch (error) {
                    console.log('error in checkIfDeleted:',error)// handle error
                  } 
               
       
            });
        });
    }    


    await getFanficList();

    return await Promise.all(promises2).then(async () => {
        let newDeletedCounter = 0;
        await gotDeletedArray.forEach(async function(fanfic, index) {
            fanfic.LastUpdateOfNote=new Date().getTime();
            // console.log(`${fanfic.FanficTitle} got deleted`)
            mongoose.dbFanfics.collection('deletedFanfics').findOne({FanficID: fanfic.FanficID }, async function(err, dbFanfic) {
                err && console.log(clc.red('error in findNextBunchOfFanfics(): ',err))
                let isExist = (dbFanfic===null) ? false : true;
                if(!isExist){     
                    console.log(clc.redBright(`inserting: ${fanfic.FanficTitle}`))
                    newDeletedCounter++                          
                    await mongoose.dbFanfics.collection(fandomName).updateOne({ 'FanficID': fanfic.FanficID},{$set: {Deleted:true}})
                    await mongoose.dbFanfics.collection('deletedFanfics').insertOne(fanfic)
                    console.log(clc.redBright(`Found new deleted fanfic:: ${fanfic.FanficTitle}`))    
                }else{
                    console.log('Duplicate fanfic, ignored and moving on')
                }
            })                                  
       })
    }).then(async res=>{
        let DeletedCounter=[];
        console.log('promise all')
        console.log('fandomName:',fandomName)
        console.log('gotDeletedArray.length:',gotDeletedArray.length)
        await FandomModal.updateOne({ 'FandomName': fandomName },{ $set: { 'AO3.DeletedFanfics':Number(gotDeletedArray.length)}},(err, result) => {(err) ? console.log('error:',err) : console.log('update deleted!')});
        DeletedCounter.push(gotDeletedArray.length)
        DeletedCounter.push(newDeletedCounter)
        return DeletedCounter
    }).catch(error => console.log(clc.red('Error in checkIfDeletedFromAO3()',error))); 
}

//TODO: add status deleted too fanfic for my update follow up

//problem : 20372752