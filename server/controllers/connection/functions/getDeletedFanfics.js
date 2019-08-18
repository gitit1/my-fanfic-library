/*
    "GET/UPDATE DELETED FANFICS" BUTTON ON CLIENT
*/
const clc = require("cli-color");
const downloader =  require('../../downloader/downloader')
const now  = require('performance-now')

const getDeletedFanfics = async (socket,fandom) => {
    const {FandomName,AO3FanficsInFandom} = fandom    

    console.log(clc.cyanBright(`Server got fandom: ${FandomName}`));
    socket && socket.emit('getFanficsData', `<b>Server got fandom:</b> ${FandomName}`);

    console.log(clc.cyanBright(`Executing: checkIfDeletedFromAO3()`));
    socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">checkIfDeletedFromAO3()</span>`);

    let startTime = now(); 
    let deletedCounters = await downloader.getDeletedFanfics(FandomName,AO3FanficsInFandom);
    console.log('deletedCounters',deletedCounters)
    let endTime = now();
    console.log(clc.cyanBright(`Deleted Fanfics data of ${FandomName} was updated!`));
    socket && socket.emit('getFanficsData', `<span style="color:green"><b>Deleted Fanfics data of ${FandomName} was updated!:</b></span>`)
    socket && socket.emit('getFanficsData', `<b>The function:</b> <span style="color:brown">checkIfDeletedFromAO3()</span> was running for ${((endTime-startTime)/1000).toFixed(2)} seconds`);
    socket && socket.emit('getFanficsData', `<b>Number of New Deleted fanfics:</b> <span style="color:red">${deletedCounters[0]}</span>`);
    socket && socket.emit('getFanficsData', `<b>Number of All Deleted fanfics:</b> <span style="color:red">${deletedCounters[1]}</span>`);

    console.log(clc.cyanBright(`End`));
    socket && socket.emit('getFanficsData', `End`);
}

module.exports = { getDeletedFanfics }