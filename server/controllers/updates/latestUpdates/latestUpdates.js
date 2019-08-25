const UpdatesModal = require('../../../models/Updates');
const moment = require('moment');

exports.latestUpdates = async (req,res) =>{
    const {limit} = req.query;
    let updatedData = await this.getlatestUpdates(limit);
    res.send(updatedData.reverse());
}

exports.getlatestUpdates = async (daysLimit) =>{ 
    const dayLimit = new Date(moment().subtract(daysLimit, 'day')).getTime();

    return await UpdatesModal.find({"Date": {$gte : dayLimit}}, async function(err, dbUpdate) {
        let latestArr=[]; 
        dbUpdate.forEach(date => {
            date.Fandom.length>0 && latestArr.push(date)
        });
        return latestArr;
    })
}
