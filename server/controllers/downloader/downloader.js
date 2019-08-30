/*
TODO:  function/router: ffGetDeletedFanfics
TODO:  function/router: ffSaveMissingFanfics

TODO:  function/router: wattpadGetFanfics
TODO:  function/router: wattpadGetDeletedFanfics
TODO:  function/router: wattpadAddNewFanfic
TODO:  function/router: wattpadDownloadFanfic
TODO:  function/router: wattpadSaveMissingFanfics
*/
const multer = require('multer');
const ao3 = require('./ao3/ao3');
const ff = require('./ff/ff');
const manually = require('./manually/manually');

let request = require('request')
let jar = request.jar();

exports.getFanfics = async (fandom,method) =>{
    let getFanficsAO3 = await ao3.ao3GetFanfics(jar,fandom,method);
    console.log('getFanficsAO3:',getFanficsAO3)
    let getFanficsFF = await ff.ffGetFanfics(fandom);
    console.log('getFanficsFF:',getFanficsFF)
    let fanficsInFandom = getFanficsAO3[0]+getFanficsFF[0]
    let SavedFanfics = getFanficsAO3[1]+getFanficsFF[1]
    return [fanficsInFandom,SavedFanfics];
}
exports.getDeletedFanfics = async (fandomName,numOfAO3Fanfics) =>{
    let getDeletedFanfics = await ao3.ao3GetDeletedFanfics(jar,fandomName,numOfAO3Fanfics);
    return getDeletedFanfics;
}
exports.saveMissingFanfics = async (fandom) =>{
    //TODO: NOT WORKING PROPERLY - NEED TO FIX IT TO MATCH BOTH FF AND AO3
    let saveMissingFanfics = await ao3.ao3SaveMissingFanfics(jar,fandom);
    return saveMissingFanfics;
}

exports.getNewFanfic = async (req,res) =>{
    const {type,url,fandomName} = req.query;
    let data =null;
    if(type==='manually'){
        let upload = multer({}).single();
        await upload(req, res, async function (err) {
            data = await manually.addNewFanfic(fandomName,req.body)
            res.send(data);
        })
    }else{
        data =  url.includes('archiveofourown.org') ? await ao3.ao3AddNewFanfic(jar,url,fandomName) : 
                url.includes('fanfiction.net')  ? await ff.ffAddNewFanfic(url,fandomName) 
                // : url.includes('wattpad.com') ? await 'wattpad'
                : null;
        res.send(data);
    }

    

}
exports.saveNewFanfic = async (req,res) =>{
    const {fandomName,download,url,image} = req.query;
    console.log('fandomName,download,url,image:',fandomName,download,url,image)
    const fanfic = req.body;
    if(url==='null'){
        await manually.saveNewFanfic(fandomName,req,res).then(()=>{
            res.send();
        });
    }else{
        url.includes('archiveofourown.org') && await ao3.ao3SaveFanfic(fandomName,download,url,fanfic).then(()=>{
            res.send();
        })
        url.includes('fanfiction.net') && await ff.ffSaveFanfic(fandomName,download,url,fanfic).then(()=>{
            res.send();
        })
    }

}
