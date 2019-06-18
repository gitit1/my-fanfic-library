const clc = require("cli-color");
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path')

const mongoose = require('../config/mongoose');
const FandomModal = require('../models/Fandom');
const FanficsModal = require('../models/Fanfic');

//----------------------------------------------------------Working and implemented with cliend:
exports.addEditFandomToDB =  async (req,res) =>{
    console.log(clc.blue('[db.js] addEditFandomToDB'));

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
                console.log('add1')
                await FandomModal.findOne({FandomName: fandomName},async function(err, oldData) {
                    console.log('oldData is:',oldData)
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
                console.log('edit1')
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
    console.log(clc.blue('[db] deleteFandomFromDB'));
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
    console.log(clc.blue('[db] getAllFandomsFromDB'));
    this.getAllFandoms().then(fetchedFandoms=>{
        !fetchedFandoms ? res.send('error in [db] getAllFandomsFromDB') : res.send(fetchedFandoms)
    })
}
exports.getAllFandoms = async () =>{
    let fetchedFandoms = await FandomModal.find({}, function(err, fandoms) {
            if (err){throw err;}
    }); 
    return fetchedFandoms
}

exports.getFanficsFromDB = async (req,res) =>{
    const {FandomName,startPage,endPage} = req.query;
    console.log('FandomName: ',FandomName)
    let skip = Number(startPage-1);
    let limit = Number(endPage);

    // let fanfics = await mongoose.dbFanfics.collection(FandomName).find({}, null, {sort: {'LastUpdateOfFic': 1}}, function(err, docs) { console.log('work already!!')});
    let fanfics = []
    await mongoose.dbFanfics.collection(FandomName).find({},{sort: {'LastUpdateOfFic': -1}, skip:skip,limit:limit}, async function (err, cursor){
        let cursorArrasy =await cursor.toArray()
        cursorArrasy.forEach(function(fanfic) { 
            fanfics.push(fanfic)
        });
        res.send(fanfics)
    })
    // console.log(fanfics)
    // res.send(fanfics.data)
    // mongoose.dbFanfics.collection(FandomName).find({}).then(() => {res.send(fanfics)});
    //.sort({'LastUpdateOfFic': -1}).skip(skip).limit(limit)
    // mongoose.dbFanfics.collection(FandomName).find().sort({'LastUpdateOfFic': -1 }).skip(skip).limit(limit).exec(async function(err, fanfics) {
    //     res.send(fanfics)
    // });
    //  Fanfics.findOne({FandomName: FandomName}).sort({'Fanfics.LastUpdateOfFic': -1 }).skip(startPage-1).limit(endPage).lean().exec(async function(err, fandom) {
        //,sort:{'Fanfics.LastUpdateOfFic': 'descending }
    //  FanficsModal.findOne({FandomName: FandomName},{Fanfics:{$slice:[skip,limit]}},{sort:{'Fanfics.LastUpdateOfFic': 'asc'}},function(err, fandom) {
    //  FanficsModal.findOne({FandomName: FandomName},{Fanfics:{$slice:[skip,limit]}},{sort:{'Fanfics.LastUpdateOfFic':'asc'}},function(err, fandom) {
        // if (err) { console.log('err: ',err)}
        // sortParam = 'LastUpdateOfFic';
        // //sortParam = 'FanficTitle';
        // FanficsModal.findOne({FandomName: FandomName}).lean().exec(function(err, fandom) {
        //     let sortParam = 'LastUpdateOfFic';
            
        //     if(fandom===null){res.send(false)}else{
        //         const sortedFanficsList =fandom.Fanfics.sort(function(a, b) { 
        //             return a[sortParam] - b[sortParam];
        //         })
        //         // res.send(sortedFanficsList.slice(skip, limit))
        //         res.send(sortedFanficsList.reverse().slice(skip, limit))
        //     }
        // });
        // // fanficsLimitedList = fandom.Fanfics.slice(startPage-1, endPage);
        // //fanficsLimitedList = fandom.Fanfics
        // //const sortedFanficsList = fanficsLimitedList.sort((a, b) => a[sortParam].localeCompare(b[sortParam]))
        // // const sortedFanficsList =fandom.Fanfics.sort(function(a, b) { 
        //     //     return a[sortParam] - b[sortParam];
        //     //     }).reverse()
        //     // res.send(sortedFanficsList.slice(startPage-1, endPage))
        //     console.log('sss')
        //     // fandom.Fanfics.map(res=>console.log(res.FanficTitle))
        //     res.send(fandom.Fanfics)
        //     });
            
            // FanficsModal.aggregate([
            //    { "$match": {FandomName: FandomName}},
            //    {$slice:["$Fanfics",skip,limit]}, 
            //    {$unwind: "$Fanfics"}, 
            //    {$sort: {"Fanfics.LastUpdateOfFic":1}}, 
            //  ]).exec(function(err, fandom) {
            //    console.log(fandom)
            //  })
    // Fanfics.findOne({FandomName: FandomName}, async function(err, fandom) {
    //     if (err) { console.log('err: ',err)}
    //     sortParam = 'LastUpdateOfFic';
    //     //sortParam = 'FanficTitle';

    //     // fanficsLimitedList = fandom.Fanfics.slice(startPage-1, endPage);
    //     //fanficsLimitedList = fandom.Fanfics
    //     //const sortedFanficsList = fanficsLimitedList.sort((a, b) => a[sortParam].localeCompare(b[sortParam]))
    //     const sortedFanficsList =fandom.Fanfics.sort(function(a, b) { 
    //         return a[sortParam] - b[sortParam];
    //         }).reverse()
    //     res.send(sortedFanficsList.slice(startPage-1, endPage))
    // });
}



//*************************************************************** */

/* --------------------------------------------------------- OLD*/
//Connection between DB/AO3:
exports.getFanficsFromAo3 = (req,res) =>{
    console.log(clc.blue('[db] getFanficsFromAo3'));
     let FandomNameOriginal = "Avalance";
     //let FandomNameOriginal = "Avalance";
     //let FandomNameOriginal = "Cazzie";

    axios.get(`https://my-fanfic-lybrare.firebaseio.com/fandoms.json?orderBy="FandomName"&equalTo="${FandomNameOriginal}"`)
    .then( async fandom => {
        fandomData = fandom.data[Object.keys(fandom.data)[0]];
        
        let FandomName = fandomData.SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
        
        let fanfics = await getFanficsOfFandom(FandomName,fandomData.AutoSave,fandomData.SaveMethod);
        await deleteDataOfFanficsFromServer(FandomNameOriginal)
        await sendFanficsToServer(FandomNameOriginal,fanfics)

        res.send(JSON.stringify(fanfics, null, 4));
        //TODO: send to server each note
        //TODO: UPDATE-FANFICS

        //res.send(fandom.data[Object.keys(fandom.data)[0]])
    } ).catch(error => {
        res.send(error.message)
    })
}

exports.addFandomToDB = (req,res) =>{   
    console.log(clc.blue('[db] addFandomToDB'));
    //TODO: check errors for image: size/not uplode/not image...
    

    //res.send('Error')

    let pathForImage = `../client/src/assets/images/fandoms/${req.query.FandomName}`;   
    let ImageName = `../client/src/assets/images/fandoms/${req.query.FandomName}`;

    console.log('image: ',req.query.Image)
    console.log('!fs.existsSync(pathForImage): ',!fs.existsSync(pathForImage))
    console.log('req.query.Image: ',req.query.Image)

    if (!fs.existsSync(pathForImage) && req.query.Image){
        console.log('!fs.existsSync(pathForImage) 2: ',!fs.existsSync(pathForImage))
        console.log('req.query.Image 2: ',req.query.Image)
        fs.mkdirSync(pathForImage);
    }

    console.log('req.file:',req.file)
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, pathForImage)
        },
        filename: function (req, file, cb) {
        cb(null, req.query.FandomName + path.extname(file.originalname))
        // cb(null, Date.now() + '-' +file.originalname )
        }
    })
    let upload = multer({ storage: storage }).single('file');

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            //return res.status(500).json(err)
            console.log('Muller Error',res.status(500).json(err));
            return res.send('Error');
        } else if (err) {  
            console.log('Other Error',err);
            //return res.status(500).json(err)
            return res.send('Error');
        }

 

        let image = null;
        if(req.query.mode === 'add'){
            image = req.file === undefined||req.file === null ? '' : (req.query.FandomName + path.extname(req.file.originalname));
        }else{
            image = req.file === undefined||req.file === null ? req.body.Image_Name : (req.query.FandomName + path.extname(req.file.originalname));
        }
       console.log('image:',image)

        const fandom = {    
            "id":                       Date.now(),
            "FandomName":               req.body.FandomName,
            "SearchKeys":               req.body.SearchKeys,
            "AutoSave":                 req.body.AutoSave,
            "SaveMethod":               req.body.SaveMethod,
            "FanficsInFandom":          req.body.FanficsInFandom,
            "OnGoingFanfics":           req.body.OnGoingFanfics,
            "CompleteFanfics":          req.body.CompleteFanfics,
            "SavedFanfics":             req.body.SavedFanfics,
            "LastUpdate":               req.body.LastUpdate,
            "Image_Name":               image
        }
        console.log(req.body.fandomsNames)

        if(req.query.mode === 'add'){
            var fandomArray = req.body.fandomsNames.split(",");
            if(req.body.fandomsNames.length>0 && fandomArray.includes(fandom.FandomName)){
                console.log(clc.red('Fandom Already Exist'));
                return res.send('Fandom Already Exist');
            }
            console.log('axios add')
            axios.post( 'https://my-fanfic-lybrare.firebaseio.com/fandoms.json', fandom )
            .then( () => {
                console.log('Fandom '+fandom.FandomName+' ,added to db')
                return 'Fandom '+fandom.FandomName+' ,added to db'
            } )
            .catch( error => {
                console.log('error 1')
                console.log(clc.red(error));
                // return res.send('Error');
            } );
        }else{
            console.log('axios edit')
            axios.patch(`https://my-fanfic-lybrare.firebaseio.com/fandoms/${req.body.FandomID}.json`, fandom )
            .then( () => {
                console.log('Fandom '+fandom.FandomName+' ,was updated in the db')
                return 'Fandom '+fandom.FandomName+' ,was updated in the db'
            } )
            .catch( error => {
                console.log('error 2')
                console.log(clc.red(error));
                // return res.send('Error');
            } );
        }

        
        
        // return res.status(200).send(req.file)
        // return res.status(200).send(req.file)
        console.log('Success')
        return res.send('Success');

    })

    //TODO: ADD FIXED IMAGE TO  FANFICS / ADDITIONAL IMAGE FOR ONESHOT IF THEY WANT 
    //console.log(date)
    //console.log(new Date(date).toLocaleString())
    
}
const getAllFanficsFromServer = (FandomName) => {
    console.log(clc.blue('[db] getAllFanficsFromServer'));
    console.log('FandomName:',FandomName)
    return axios.get( `https://my-fanfic-lybrare.firebaseio.com/fanfics/${FandomName}.json`)
    .then( response => {
        return(response.data)
    } )
    .catch( error => {
        console.log(clc.red(error));
        return('error in [db] getAllFanficsFromServer')
    } );    
}
const deleteOldDataOfFanficsFromServer = (socket,FandomName) => {
    axios.delete(`https://my-fanfic-lybrare.firebaseio.com/fanfics/${FandomName}.json`)
    .then(() =>{
        return true
    }).catch(error=>{
        // console.log('couldent delete: ',error)
        return false
    })
}

const sendFanficsToServer =  async (socket,fandom,fanfics) => {
    console.log(clc.blue('[db] sendFanficsToServer'));

    const fanficData = new Fanfic(fanfics);
    await fanficData.save();
    console.log(`Fanfics of ${fandom.FandomName} was saved to server`)
}
