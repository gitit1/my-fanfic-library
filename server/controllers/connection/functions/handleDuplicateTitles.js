const clc = require("cli-color");
const { getListOfDuplicateTitles } = require('../../downloader/manually/handleDuplicateTitles/getListOfDuplicateTitles');

const handleDuplicateTitles = async (socket, log, fandom) => {
    const { FandomName } = fandom;
    console.log(clc.cyanBright(`Handle Duplicate Titles - Server got fandom: ${FandomName}`));
    socket && socket.emit('getFanficsData', `<b style="color:brown">Handle Duplicate Titles<b/>`);
    socket && socket.emit('getFanficsData', `Loading Data...`);
    
    const list = await getListOfDuplicateTitles(log, fandom);
    socket && socket.emit('getDuplicateList', list);
    if(list.length===0){
        socket && socket.emit('getFanficsData', `<b style="color:green">There is No Duplication that we didn't handle in this fandom.</b>`);
    } else {
        socket && socket.emit('getFanficsData', `Got <b>${list.length}</b> pairs of duplicates!`);
        socket && socket.emit('getFanficsData', `<b style="color:red">Lets Start Comparing them!<b/>`);
        socket && socket.emit('getFanficsData', `Loading...`);
    }
    socket && socket.emit('getFanficsData', `End!`);
}

module.exports = { handleDuplicateTitles }