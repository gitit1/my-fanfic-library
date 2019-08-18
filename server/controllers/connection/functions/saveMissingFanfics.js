/*
    "SAVE MISSING FANFICS" BUTTON ON CLIENT
*/
const clc = require("cli-color");
const downloader =  require('../../downloader/downloader')
const now  = require('performance-now')

const saveMissingFanfics = async (socket,fandom) => {
    const {FandomName} = fandom 

    console.log(clc.cyanBright(`Server got fandom: ${FandomName}`));
    socket && socket.emit('getFanficsData', `<b>Server got fandom:</b> ${FandomName}`);

    socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">checkIfFileExsist()</span> to save the missing fanfics`);

    let startTime = now(); 
    let sum = await downloader.saveMissingFanfics(FandomName);
    console.log(`saved ${sum} unsaved files`)
    let endTime = now();  

    socket && socket.emit('getFanficsData', `Saved ${sum} unsaved files</b></span>`)
    socket && socket.emit('getFanficsData', `<b>The function:</b> <span style="color:brown">checkIfFileExsist()</span> was running for ${((endTime-startTime)/1000).toFixed(2)} seconds`);

    console.log(clc.cyanBright(`End`));
    socket && socket.emit('getFanficsData', `End`);     
}

module.exports = { saveMissingFanfics }