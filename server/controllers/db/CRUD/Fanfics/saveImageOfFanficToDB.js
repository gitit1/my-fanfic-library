const clc = require("cli-color");
const multer = require('multer');
const fs = require('fs-extra');

const mongoose = require('../../../../config/mongoose.js');


exports.saveImageOfFanficToDB =  async (req,res) =>{
    console.log(clc.blue('[db controller] saveImageOfFanficToDB()'));

    let {fandomName,fanficId} = req.query;
    console.log('fandomName,fanficId',fandomName,fanficId)
    fandomName = fandomName.replace("%26","&").toLowerCase();
    const pathForImage = `public/fandoms/${fandomName}/fanficsImages/`
    console.log('pathForImage',pathForImage)
    let resultMessage = '';
 

    if (!fs.existsSync(pathForImage)){
        console.log('path not exist')
        fs.mkdirSync(pathForImage,{recursive: true});
    }

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, pathForImage)
        },
        filename: function (req, file, cb) {
        cb(null,   file.fieldname)
        }
    });
    
    let upload = multer({ storage: storage }).any();

    await upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log('Muller Error',res.status(500).json(err));
            resultMessage = 'Error';
            return res.send(resultMessage);
        } else if (err) {  
            console.log('Other Error',err);
            resultMessage = 'Other Error';
            return res.send(resultMessage);
        }
 
        mongoose.dbFanfics.collection(req.query.fandomName).updateOne({FanficID: Number(fanficId)},{$set: {image:req.body['fileName']}}, async function (error, response) {
            res.send(true)
        })
    
    })
  
}