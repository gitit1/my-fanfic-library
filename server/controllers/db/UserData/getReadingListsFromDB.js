
const {getReadingLists} = require('../helpers/getReadingLists');

exports.getReadingListsFromDB = async (req,res) =>{
    console.log('getReadingListsFromDB()')
    let rl = await getReadingLists(req.query.userEmail);
    res.send(rl[1]);
}