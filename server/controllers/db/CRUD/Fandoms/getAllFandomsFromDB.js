const clc = require("cli-color");
const FandomModal = require('../../../../models/Fandom');

exports.getAllFandomsFromDB = (req,res) =>{
    console.log(clc.xterm(175)('[db controller] getAllFandomsFromDB()'));
    this.getAllFandoms().then(fetchedFandoms=>{
        !fetchedFandoms ? res.send('error in [db] getAllFandomsFromDB') : res.send(fetchedFandoms)
    })
}
exports.getAllFandoms = async () =>{
    console.log(clc.xterm(175)('[db controller] getAllFandoms()'));
    let fetchedFandoms = await FandomModal.find({}, function(err, fandoms) {
            if (err){throw err;}
    });
    return fetchedFandoms
}