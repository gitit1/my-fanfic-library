const clc = require("cli-color");
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path')

const mongoose = require('../config/mongoose');
const FandomModal = require('../models/Fandom');
const FanficSchema = require('../models/Fanfic');

exports.addEditFandomToDB =  async (req,res) =>{
    console.log(clc.blue('[db controller] addEditFandomToDB()'));

    let {fandomName,mode,image,imageDate} = req.query
    let resultMessage = '';
    let pathForImage = 'public/Fandoms/';
    fandomName = fandomName.replace("%26","&");
    
    let isImage = JSON.parse(image);
    let imageName = fandomName+'_'+imageDate;

    //check if path for image exsist (if fandom exsist) and if image was requested 
    if (!fs.existsSync(pathForImage+fandomName) && isImage){
        fs.mkdirSync(pathForImage+fandomName,{recursive: true});
    }
    //setting of multer
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, pathForImage+fandomName)
        },
        filename: function (req, file, cb) {
        cb(null,  imageName + path.extname(file.originalname))
        }
    })
    let upload = multer({ storage: storage }).single('file');
    
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
        //check if I have an updated image/prev image/no image
        if(mode === 'add'){
            imageName = isImage ? (imageName + path.extname(req.file.originalname)) : '';
        }else{
            imageName = isImage ? (imageName + path.extname(req.file.originalname)) : req.body.Image_Name
            console.log('req.body.Image_Name:',req.body.Image_Name)
            if(image){
                let path = pathForImage+fandomName+'/'+req.body.Image_Name;
                //if image is changed delete the old one
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                });
            }
        }
        const fandom = {    
            "id":                       req.body.id,
            "FandomName":               req.body.FandomName,
            "SearchKeys":               req.body.SearchKeys,
            "AutoSave":                 req.body.AutoSave,
            "SaveMethod":               req.body.SaveMethod,
            "FanficsInFandom":          req.body.FanficsInFandom,
            "OnGoingFanfics":           req.body.OnGoingFanfics,
            "CompleteFanfics":          req.body.CompleteFanfics,
            "SavedFanfics":             req.body.SavedFanfics,
            "LastUpdate":               Date.now(),
            "Image_Name":               imageName,
            "Image_Path":               req.body.FandomName
        }
        //TODO:add already exsist:
        try {
            if(req.query.mode === 'add'){
                console.log('add mode')
                await FandomModal.findOne({FandomName: fandomName},async function(err, oldData) {
                    if(oldData!==null){
                        console.log(clc.red('Fandom '+fandomName+' Already Exist'))
                        resultMessage = 'Fandom Already Exist';
                        return res.send(resultMessage)
                    }else{
                        const fandomData = new FandomModal(fandom);
                        console.log(clc.green(`Fandom ${fandomName}  was updated in the db`))
                        await fandomData.save();
                        await mongoose.dbFanfics.createCollection(fandomName);
                        resultMessage = 'Success';
                        return res.send(resultMessage)
                    }
                });               
            }else{
                console.log('edit mode')
                FandomModal.updateOne(
                    { 'FandomName': fandomName },
                    { $set: fandom},
                    (err, result) => {
                        if (err){
                            console.log(clc.red('Error in updating fandom'))
                            resultMessage = 'Error';
                            return res.send(resultMessage)
                        }else{
                            console.log(clc.green(`Fandom ${fandomName} was updated!`));
                            resultMessage = 'Success';
                            return res.send(resultMessage)
                        };
                     }
                 )
            }    
        } catch (error) {
            console.log(`Error in addEditFandomToDB()`)
            resultMessage = 'Error';
            return res.send(resultMessage);
        }     
        // console.log('resultMessage:',resultMessage)
        // return resultMessage
    
    })
  
}
exports.deleteFandomFromDB = async (req,res)=>{
    console.log(clc.blue('[db controller] deleteFandomFromDB()'));
    let fandomName = req.query.fandomName.replace("%26","&")
    let path = `public/Fandoms/${fandomName}`;
    try {
        await FandomModal.findOneAndDelete(
            { FandomName: fandomName.replace("%26","&") },() => console.log(clc.green(`${fandomName} fandom node got deleted from db`))
        );
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

exports.getAllFandomsFromDB = (req,res) =>{
    console.log(clc.blue('[db controller] getAllFandomsFromDB()'));
    this.getAllFandoms().then(fetchedFandoms=>{
        !fetchedFandoms ? res.send('error in [db] getAllFandomsFromDB') : res.send(fetchedFandoms)
    })
}
exports.getAllFandoms = async () =>{
    console.log(clc.blue('[db controller] getAllFandoms()'));
    let fetchedFandoms = await FandomModal.find({}, function(err, fandoms) {
            if (err){throw err;}
    }); 
    return fetchedFandoms
}

exports.getFanficsFromDB = async (req,res) =>{
    console.log(clc.blue('[db controller] getFanficsFromDB()'));
    let {FandomName,skip,limit} = req.query;

    skip = Number(skip-1); limit = Number(limit);
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,FandomName);
    FanficDB.find().sort({['LastUpdateOfFic']: -1 }).skip(skip).limit(limit).exec(async function(err, fanfics) {
        res.send(fanfics)
    })
}