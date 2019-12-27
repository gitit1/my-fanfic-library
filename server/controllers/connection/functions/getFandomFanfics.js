/*
    "GET/UPDATE FANFICS" BUTTON ON CLIENT
*/
const clc = require("cli-color");
const downloader =  require('../../downloader/downloader')
// const ao3 =  require('../../downloader/ao3/ao3')
const now  = require('performance-now')


const getFandomFanfics = async (socket,fandom,type) => {
    const {FandomName,SearchKeys,AutoSave,SaveMethod} = fandom
    // console.log('....metgod is: ',method)
    console.log(clc.cyanBright(`Server got fandom: ${FandomName}`));
    socket && socket.emit('getFanficsData', `<b>Server got fandom:</b> ${FandomName}`);

    console.log(clc.cyanBright(`Server got keys: ${SearchKeys}`));
    socket && socket.emit('getFanficsData', `<b>Server got keys:</b> ${SearchKeys}`);
    

    let fandomUrlName = SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
    socket && socket.emit('getFanficsData', `<b>Fixing keys to match url search:</b> ${fandomUrlName}`);

    console.log(clc.cyanBright(`Executing: getFanficsOfFandom()`));
    socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">getFanficsOfFandom()</span>`);

    let startTime = now(); 
    let fanficsLengths = await downloader.getFanfics(fandom,type);
    console.log('fanficsLengths:',fanficsLengths)
    let endTime = now();
    console.log(clc.cyanBright(`Fanfics data of ${FandomName} was updated!`));
    socket && socket.emit('getFanficsData', `<span style="color:green"><b>Fanfics data of ${FandomName} was updated!:</b></span>`)
    socket && socket.emit('getFanficsData', `<b>The function:</b> <span style="color:brown">getFanficsOfFandom()</span> was running for ${((endTime-startTime)/1000).toFixed(2)} seconds`);

    console.log(clc.cyanBright(`Got ${fanficsLengths[0]} from getFanficsOfFandom()`)),
    socket && socket.emit('getFanficsData', `Got ${fanficsLengths[0]} from <span style="color:brown">getFanficsOfFandom()</span>`)
  
    console.log(clc.cyanBright(`Saved ${fanficsLengths[1]} to Server`)),
    socket && socket.emit('getFanficsData', `Saved ${fanficsLengths[1]} to Server`)

    console.log(clc.cyanBright(`End`));
    socket && socket.emit('getFanficsData', `End`);

    return null;
}

module.exports = { getFandomFanfics }