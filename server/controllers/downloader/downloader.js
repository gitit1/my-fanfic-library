/*
TODO:  function/router: ffGetFanfics                        
TODO:  function/router: ffGetDeletedFanfics
TODO:  function/router: ffSaveMissingFanfics

TODO:  function/router: wattpadGetFanfics
TODO:  function/router: wattpadGetDeletedFanfics
TODO:  function/router: wattpadAddNewFanfic
TODO:  function/router: wattpadDownloadFanfic
TODO:  function/router: wattpadSaveMissingFanfics
*/
const ao3 = require('./ao3/ao3');
const ff = require('./ff/ff');

let request = require('request')
let jar = request.jar();
// request = request.defaults({jar: jar,followAllRedirects: true});

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
    let saveMissingFanfics = await ao3.ao3SaveMissingFanfics(jar,fandom);
    return saveMissingFanfics;
}

exports.getNewFanfic = async (req,res) =>{
    const {url,fandomName} = req.query;
    const data =    url.includes('archiveofourown.org') ? await ao3.ao3AddNewFanfic(jar,url,fandomName) : 
                    url.includes('fanfiction.net')  ? await ff.ffAddNewFanfic(url,fandomName) 
                 
                // : url.includes('wattpad.com') ? await 'wattpad'
                : null;
    res.send(data);

}
exports.saveNewFanfic = async (req,res) =>{
    const {fandomName,download,url,image} = req.query;
    const fanfic = req.body;
    url.includes('archiveofourown.org') && await ao3.ao3SaveFanfic(fandomName,download,url,fanfic).then(()=>{
        res.send();
    })
    url.includes('fanfiction.net') && await ff.ffSaveFanfic(fandomName,download,url,fanfic).then(()=>{
        res.send();
    })

}
