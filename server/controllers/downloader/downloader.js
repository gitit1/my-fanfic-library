/*
TODO:  function/router: ao3GetFanfics                       |DONE
TODO:  function/router: ao3GetDeletedFanfics                |DONE
TODO:  function/router: ao3SaveMissingFanfics               |DONE
TODO:  function/router: ao3AddNewFanfic                     |DONE

TODO:  function/router: ao3SaveFanfic

TODO:  function/router: ffGetFanfics                        
TODO:  function/router: ffGetDeletedFanfics
TODO:  function/router: ffAddNewFanfic                      |DONE
TODO:  function/router: ffSaveFanfic                        |DONE
TODO:  function/router: ffSaveMissingFanfics

TODO:  function/router: wattpadGetFanfics
TODO:  function/router: wattpadGetDeletedFanfics
TODO:  function/router: wattpadAddNewFanfic
TODO:  function/router: wattpadDownloadFanfic
TODO:  function/router: wattpadSaveMissingFanfics
*/
const ao3 = require('./ao3/ao3');
const ff = require('./ff/ff');

exports.getFanfics = async (fandom,method) =>{
    let getFanfics = await ao3.ao3GetFanfics(fandom,method);
    return getFanfics;
}

exports.getDeletedFanfics = async (fandom,numOfAO3Fanfics) =>{
    let getDeletedFanfics = await ao3.ao3GetDeletedFanfics(fandom,numOfAO3Fanfics);
    return getDeletedFanfics;
}

exports.saveMissingFanfics = async (fandom) =>{
    let saveMissingFanfics = await ao3.ao3SaveMissingFanfics(fandom);
    return saveMissingFanfics;
}

exports.getNewFanfic = async (req,res) =>{
    const {url,fandomName} = req.query;
    const data =  url.includes('fanfiction.net')  ? await ff.ffAddNewFanfic(url,fandomName) 
                : url.includes('archiveofourown.org') ? await ao3.ao3AddNewFanfic(url,fandomName) 
                // : url.includes('wattpad.com') ? await 'wattpad'
                : null;
    res.send(data);

}

exports.saveNewFanfic = async (req,res) =>{
    const {fandomName,download,url,image} = req.query;
    const fanfic = req.body;

    url.includes('fanfiction.net') && await ff.ffSaveFanfic(fandomName,download,url,fanfic).then(()=>{
        res.send();
    })
    url.includes('archiveofourown.org') && await ao3.ao3SaveFanfic(fandomName,download,url,fanfic).then(()=>{
        res.send();
    })
}
