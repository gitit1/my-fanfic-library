const {latestUpdates} = require('./latestUpdates/latestUpdates')

exports.latestUpdates = async (req,res) =>{
    // let updatedData = await latestUpdates(req.body);
    let updatedData = ['Clexa','Avalance']
    // console.log('updatedData:',updatedData)
    // res.send(JSON.stringify(updatedData, null, 1));
    res.send(updatedData);
}
