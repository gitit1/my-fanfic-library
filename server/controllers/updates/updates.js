const {latestUpdates} = require('./latestUpdates/latestUpdates')

exports.latestUpdates = async (req,res) =>{
    let updatedData = await latestUpdates(req.body);
    res.send(updatedData.reverse());
}
