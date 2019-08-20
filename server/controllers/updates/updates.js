const {latestUpdates} = require('./latestUpdates/latestUpdates')

exports.latestUpdates = async (req,res) =>{
    fandom = 'Clexa';
    let updatedData = await latestUpdates(fandom);
    res.send(JSON.stringify(updatedData));
    // res.send(updatedData);
}
