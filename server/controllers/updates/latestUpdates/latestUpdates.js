const UpdatesModal = require('../../../models/Updates');
const moment = require('moment');

const daysLimit=5;

exports.latestUpdates = async () =>{ 
    const dayLimit = new Date(moment().subtract(daysLimit, 'day')).getTime();

    return await UpdatesModal.find({"Date": {$gte : dayLimit}}, async function(err, dbUpdate) {
        let latestArr=[]; 
        dbUpdate.forEach(date => {
            date.Fandom.length>0 && latestArr.push(date)
        });
        return latestArr;
    })
}
