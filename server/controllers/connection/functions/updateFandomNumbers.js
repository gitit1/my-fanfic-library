const clc = require("cli-color");
const { updateFandomFanficsNumbers } = require('../../downloader/helpers/functions/updateFandomFanficsNumbers')
const FandomModal = require('../../../models/Fandom');

const updateFandomNumbers = async (socket, fandom, ao3, ff) => {
    const { FandomName } = fandom

    console.log(clc.cyanBright(`Update Fandom Numbers - Server got fandom: ${FandomName}`));
    socket && socket.emit('getFanficsData', `<b>Update Fandom Numbers - Server got fandom:</b> ${FandomName}`);

    socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">updateFandomNumbers()</span>`);

    const sources = ao3 && ff ? ['AO3','FF'] : ao3 ? ['AO3'] : ff ? ['FF'] : [];

    console.log('sources:',sources)
    sources.map(async source => {
        await updateFandomFanficsNumbers(fandom, source);
        await FandomModal.find({ 'FandomName': FandomName }, function (err, fandomNewData) { 
            if (err) { throw err; } 
            socket && socket.emit('getFanficsData', `--------${FandomName} Numbers of ${source}:--------`)
            socket && socket.emit('getFanficsData', `<b style="color:brown">Fanfics In Fandom:</b> ${fandomNewData[0].FanficsInFandom}`)
            socket && socket.emit('getFanficsData', `<b>Total ${source} Fanfics In Fandom:</b> ${fandomNewData[0][source].TotalFanficsInFandom}`)
            socket && socket.emit('getFanficsData', `<b>${source} Fanfics In Site:</b> ${fandomNewData[0][source].FanficsInSite}`)
            socket && socket.emit('getFanficsData', `<b>${source} Complete Fanfics:</b> ${fandomNewData[0][source].CompleteFanfics}`)
            socket && socket.emit('getFanficsData', `<b>${source} On Going Fanfics:</b> ${fandomNewData[0][source].OnGoingFanfics}`)
            socket && socket.emit('getFanficsData', `<b>${source} Saved Fanfics:</b> ${fandomNewData[0][source].SavedFanfics}`)
            socket && socket.emit('getFanficsData', `<b>${source} Deleted Fanfics:</b> ${fandomNewData[0][source].DeletedFanfics}`)
            socket && socket.emit('getFanficsData', `<br/>`)
        });

    })
}

module.exports = { updateFandomNumbers }