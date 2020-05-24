/*
    TODO:  (need in client to make sure its not auto save and if not run get fanfics and then saveFanficsToServer)
    "GET/UPDATE FANFICS" BUTTON ON CLIENT - with save fanfics
*/
/*
    "SAVE MISSING FANFICS" BUTTON ON CLIENT
*/
const clc = require("cli-color");
const downloader =  require('../../downloader/downloader')
const now  = require('performance-now')

const saveFanfics = async (socket,fandom,method) => {
    const {FandomName} = fandom    

    console.log(clc.cyanBright(`Server got fandom: ${FandomName}`));
    socket && socket.emit('getFanficsData', `<b>Server got fandom:</b> ${FandomName}`);

    socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">getFanficsOfFandom()</span> to get the most updated fanfics`);

    let startTime = now(); 
    let savedCounters = await downloader.saveFanficsToServer(fandom,method);
    console.log('savedCounters',savedCounters)
    let endTime = now();

    console.log(clc.cyanBright(`Saved ${savedCounters[1]} Fanfics to ${FandomName} Fandom!`));
    socket && socket.emit('getFanficsData', `Saved ${savedCounters[1]} Fanfics to ${FandomName} Fandom!</b></span>`)
    socket && socket.emit('getFanficsData', `<b>The function:</b> <span style="color:brown">saveFanficsToServer()</span> was running for ${((endTime-startTime)/1000).toFixed(2)} seconds`);
    //TODO: add to fandom model - last time of saved fanfics - then compare it in saveFanficsToServer() - if null - this is an init , if not this is an update

    console.log(clc.cyanBright(`End`));
    socket && socket.emit('getFanficsData', `End`);   
}

module.exports = { saveFanfics }