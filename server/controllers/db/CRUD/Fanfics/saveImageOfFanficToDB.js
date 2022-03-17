const clc = require("cli-color");
const multer = require('multer');
const fs = require('fs-extra');

const mongoose = require('../../../../config/mongoose.js');
const {fixStringForPath} = require('../../../helpers/fixStringForPath.js');

exports.saveImageOfFanficToDB =  async (req,res) =>{
    console.log(clc.xterm(175)('[db controller] saveImageOfFanficToDB()'));

    let {fandomName,fanficId} = req.query;
    console.log('fandomName,fanficId',fandomName,fanficId)
    fandomName = fandomName.replace("%26","&").toLowerCase();
    const pathForImage = `public/fandoms/${fandomName}/fanficsImages/`
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
        cb(null,  fixStringForPath(file.fieldname))
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
 
        mongoose.dbFanfics.collection(req.query.fandomName).updateOne({FanficID: Number(fanficId)},{$set: {image:fixStringForPath(req.body['fileName'])}}, async function (error, response) {
            res.send(true)
        })
    
    })
  
}