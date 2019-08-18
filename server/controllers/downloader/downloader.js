/*
TODO:  function/router: ao3GetFanfics

TODO:  function/router: ao3GetDeletedFanfics
TODO:  function/router: ao3AddNewFanfic
TODO:  function/router: ao3DownloadFanfic
TODO:  function/router: ao3SaveMissingFanfics

TODO:  function/router: ffGetFanfics
TODO:  function/router: ffGetDeletedFanfics
TODO:  function/router: ffAddNewFanfic
TODO:  function/router: ffDownloadFanfic
TODO:  function/router: ffSaveMissingFanfics

TODO:  function/router: wattpadGetFanfics
TODO:  function/router: wattpadGetDeletedFanfics
TODO:  function/router: wattpadAddNewFanfic
TODO:  function/router: wattpadDownloadFanfic
TODO:  function/router: wattpadSaveMissingFanfics
*/
const ao3 = require('./ao3/ao3');

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

