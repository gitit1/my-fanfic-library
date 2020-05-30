const clc = require("cli-color");
const multer = require('multer');
const fs = require('fs-extra');

const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');



exports.addEditFandomToDB = async (req, res) => {
    console.log(clc.blue('[db controller] addEditFandomToDB()'));
    console.log('req.query:', req.query);

    let { fandomName, mode, mainImage, mainImageGif, iconImage, fanficImage } = req.query;
    fandomName = fandomName.replace("%26", "&");
    const pathForImage = 'public/fandoms/', fandomNameLowerCase = fandomName.toLowerCase();
    let images = [], resultMessage = '';

    mainImage && images.push('Image_Name_Main_Still')
    mainImageGif && images.push('Image_Name_Main')
    iconImage && images.push('Image_Name_Icon')
    fanficImage && images.push('Image_Name_Fanfic')

    if (images.length > 0 && !fs.existsSync(pathForImage + fandomNameLowerCase)) {
        fs.mkdirSync(pathForImage + fandomNameLowerCase, { recursive: true });
    }

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, pathForImage + fandomNameLowerCase)
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname)
        }
    });

    let upload = multer({ storage: storage }).any();

    await upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log('Muller Error', res.status(500).json(err));
            resultMessage = 'Error';
            return res.send(resultMessage);
        } else if (err) {
            console.log('Other Error', err);
            resultMessage = 'Other Error';
            return res.send(resultMessage);
        }
        //check if I have an updated image/prev image/no image
        if (mode === 'add') {
            ImageMainStill = mainImage ? mainImage : '';
            ImageMain = mainImageGif ? mainImageGif : '';
            ImageIcon = iconImage ? iconImage : '';
            ImageFanfic = fanficImage ? fanficImage : '';
        } else {
            ImageMainStill = mainImage ? mainImage : req.body.Image_Name_Main_Still;
            ImageMain = mainImageGif ? mainImageGif : req.body.Image_Name_Main;
            ImageIcon = iconImage ? iconImage : req.body.Image_Name_Icon;
            ImageFanfic = fanficImage ? fanficImage : req.body.Image_Name_Fanfic;

            console.log('images:', images)
            images.forEach(image => {
                let path = pathForImage + fandomNameLowerCase + '/' + req.body[image];
                //if image is changed delete the old one
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                });
            });
        }
        const fandom = {
            "id": req.body.id,
            "FandomName": req.body.FandomName,
            "FandomUniverse": req.body.FandomUniverse,
            "Collection": req.body.CollectionName,
            "SearchKeys": req.body.SearchKeys,
            "AutoSave": (req.body.AutoSave === 'true') ? true : false,
            "SaveMethod": req.body.SaveMethod,
            "FanficsInFandom": Number(req.body.FanficsInFandom),
            "LastUpdate": Date.now(),
            "Images": {
                "Image_Name_Main": ImageMain,
                "Image_Name_Main_Still": ImageMainStill,
                "Image_Name_Icon": ImageIcon,
                "Image_Name_Fanfic": ImageFanfic,
                "Image_Name_Path": req.body.FandomName
            }
        }
        // if(req.body.AutoSave === 'true'){
        fs.mkdirSync(pathForImage + fandomNameLowerCase + '/fanfics', { recursive: true });
        fs.mkdirSync(pathForImage + fandomNameLowerCase + '/fanficsImages', { recursive: true });
        // }
        //TODO:add already exsist:
        try {
            if (req.query.mode === 'add') {
                console.log('add mode')
                await FandomModal.findOne({ FandomName: fandomName }, async function (err, oldData) {
                    if (oldData !== null) {
                        console.log(clc.red('Fandom ' + fandomName + ' Already Exist'))
                        resultMessage = 'Fandom Already Exist';
                        return res.send(resultMessage)
                    } else {
                        const fandomData = new FandomModal(fandom);
                        console.log(clc.green(`Fandom ${fandomName}  was updated in the db`))
                        await fandomData.save();
                        if (!req.body.CollectionName || req.body.CollectionName === '') {
                            await mongoose.dbFanfics.createCollection(fandomName);
                        } else {
                            await mongoose.dbFanfics.createCollection(req.body.CollectionName);
                        }
                        resultMessage = 'Success';
                        return res.send(resultMessage)
                    }
                });
            } else {
                console.log('edit mode')
                FandomModal.updateOne(
                    { 'FandomName': fandomName },
                    { $set: fandom },
                    (err, result) => {
                        if (err) {
                            console.log(clc.red('Error in updating fandom'))
                            resultMessage = 'Error';
                            return res.send(resultMessage)
                        } else {
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

    })

}