const clc = require("cli-color");
const fs = require('fs-extra');

const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

exports.deleteFandomFromDB = async (req,res)=>{
    console.log(clc.blue('[db controller] deleteFandomFromDB()'));
    let fandomName = req.query.fandomName.replace("%26","&")
    let fandomNameLowerCase = fandomName.toLowerCase();
    let path = `public/fandoms/${fandomNameLowerCase.toLowerCase()}`;
    try {
        await FandomModal.findOneAndDelete(
            { FandomName: fandomName.replace("%26","&") },() => console.log(clc.green(`${fandomName} fandom node got deleted from db`))
        );
        await FandomModal.remove({ FandomName: fandomName.replace("%26","&") })
        await mongoose.dbFanfics.collection(fandomName).drop().then(
            console.log(clc.green(`${fandomName} got fanfics collection deleted from db`))
        );
        if (fs.existsSync(path)){
            await fs.remove(path)
        }
        res.send('Success')
     }
     catch(e){
        console.log(clc.red('Error in deleteFandomFromDB()'))
        res.send('Error')
     }
}

//TODO: remove userdata/activities