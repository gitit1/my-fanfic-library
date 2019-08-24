
const mongoose = require('../../../config/mongoose');
const UpdatesModal = require('../../../models/Updates');
const moment = require('moment');

const daysLimit=5;

exports.latestUpdates = async () =>{ 
    const dayLimit = new Date(moment().subtract(daysLimit, 'day')).getTime();

    return await UpdatesModal.find({"Date": {$gte : dayLimit}}, async function(err, dbUpdate) {
        console.log('dbUpdate:',dbUpdate)
        let latestArr=0; 
        dbUpdate.forEach(date => {
            date.Fandom.length>0 && latestArr.push(date)
        });
        return latestArr;
    })
}
