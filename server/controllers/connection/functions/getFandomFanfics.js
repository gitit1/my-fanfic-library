/*
    "GET/UPDATE FANFICS" BUTTON ON CLIENT
*/
const clc = require("cli-color");
const downloader = require('../../downloader/downloader')
// const ao3 =  require('../../downloader/ao3/ao3')
const now = require('performance-now')
const { createAO3Url } = require('../../downloader/ao3/ao3GetFanfics/functions/createAO3Url')

const getFandomFanfics = async (socket, log, fandom, type, ao3, ff) => {
    const { FandomName, SearchKeys, FFSearchUrl } = fandom;
    log.info(`--------------------------------Start--------------------------------`);

    console.log(clc.cyanBright(`Server got fandom: ${FandomName}`));
    log.info(`Fandom: ${FandomName}`);
    socket && socket.emit('getFanficsData', `<b>Server got fandom:</b> ${FandomName}`);

    console.log(clc.cyanBright(`Server got keys: ${SearchKeys}`));
    log.info(`Server got keys: ${SearchKeys}`);
    socket && socket.emit('getFanficsData', `<b>Server got keys:</b> ${SearchKeys}`);

    // let fandomUrlName = SearchKeys.replace(/ /g, '%20').replace(/\//g, '*s*');
    // socket && socket.emit('getFanficsData', `<b>Fixing keys to match url search:</b> ${fandomUrlName}`);
    
    if(ao3){
        const ao3URL = await createAO3Url(SearchKeys);
        socket && socket.emit('getFanficsData', `<b>AO3 URL:</b> ${ao3URL}`);
    }

    if(ff){
        socket && socket.emit('getFanficsData', `<b>FF URL:</b> ${FFSearchUrl}`);
    }

    const ao3URL = await createAO3Url(SearchKeys);
    socket && socket.emit('getFanficsData', `<b>AO3 URL:</b> ${ao3URL}`);

    console.log(clc.cyanBright(`Executing: getFanficsOfFandom()`));
    log.info(`Executing: getFanficsOfFandom:`);
    socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">getFanficsOfFandom()</span>`);

    let startTime = now();
    let fanficsLengths = await downloader.getFanfics(fandom, log, type, ao3, ff);
    let endTime = now();

    console.log(clc.cyanBright(`Fanfics data of ${FandomName} was updated!`));
    socket && socket.emit('getFanficsData', `<span style="color:green"><b>Fanfics data of ${FandomName} was updated!:</b></span>`);
    log.info(`Fanfics data of ${FandomName} was updated`);
    socket && socket.emit('getFanficsData', `<b>The function:</b> <span style="color:brown">getFanficsOfFandom()</span> was running for ${((endTime - startTime) / 1000).toFixed(2)} seconds`);

    console.log(clc.cyanBright(`Got ${fanficsLengths[0]} from getFanficsOfFandom()`));
    log.info(`Got ${fanficsLengths[0]} from getFanficsOfFandom()`);
    socket && socket.emit('getFanficsData', `Got ${fanficsLengths[0]} from <span style="color:brown">getFanficsOfFandom()</span>`)

    console.log(clc.cyanBright(`Saved ${fanficsLengths[1]} to Server`));
    socket && socket.emit('getFanficsData', `Saved ${fanficsLengths[1]} to Server`)

    console.log(clc.cyanBright(`End`));
    log.info(`--------------------------------End--------------------------------`);
    socket && socket.emit('getFanficsData', `End`);

    return null;
}

module.exports = { getFandomFanfics }