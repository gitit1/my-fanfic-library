const clc = require("cli-color");
const mongoose = require('../../../../config/mongoose');
const {createFanficObj} = require('../../helpers/functions/createFanficObj');
const multer = require('multer');

exports.updateExistFanfic = async (fandomName,req,res) =>{
    console.log(clc.blue('[downloader controller] updateExistFanfic()'));

    let upload = multer({}).any();
    await upload(req, res, async function (err) {
        let fanficObj = await createFanficObj(fandomName,req.body);
        console.log('fanficObj:',fanficObj)

        await mongoose.dbFanfics.collection(fandomName).updateOne({FanficID: Number(fanficObj.FanficID)},{$set: fanficObj}, {upsert: true})
    });


    return true;
}

