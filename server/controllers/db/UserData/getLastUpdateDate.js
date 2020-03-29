
const FandomModal = require('../../../models/Fandom');


exports.getLastUpdateDate = async (req, res) => {
    console.log('getLastUpdateDate()')
    let data = await FandomModal.find().sort({ LastUpdate: -1 }).limit(1);
    let lastUpdate = (data[0] === undefined || data[0] === null) ? (new Date()).getTime() : data[0].LastUpdate;
    res.send(String(lastUpdate));
}