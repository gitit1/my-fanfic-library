const clc = require("cli-color");
const mongoose = require('../../../../../config/mongoose.js');


exports.saveFanficCategoriesToDB = async (req,res) =>{
    console.log(clc.xterm(175)('[db controller] saveFanficCategoriesToDB()'));
    const {fandomName,fanficId,categories} = req.query;
    console.log('fandomName,fanficId,categories',fandomName,fanficId,categories);
    const categoriesArr = categories.split(',');

    mongoose.dbFanfics.collection(fandomName).updateOne({FanficID: Number(fanficId)},{$set: {Categories:categoriesArr}}, async function (error, response) {
        res.send(true)
    })
}

