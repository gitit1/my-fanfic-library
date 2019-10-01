const clc = require("cli-color");
const multer = require('multer');
const fs = require('fs-extra');

const mongoose = require('../../../../config/mongoose.js');
const UserData = require('../../../../models/UserData');

exports.saveImageOfReadingList =  async (req,res) =>{
    console.log(clc.blue('[db controller] saveImageOfReadingList()'));

    let {userEmail,name} = req.query;

    const pathForImage = `public/users/${userEmail}/readingLists/${name}`

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
 

        UserData.updateOne({ userEmail: userEmail , "ReadingList.Name": name},
        {  $set: {"ReadingList.$.image": req.body['fileName']}},
        async (err, result) => {
            if (err) throw err;
            res.send(true)
        }) 
    })
  
}