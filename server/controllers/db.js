const clc = require("cli-color");
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path')

const mongoose = require('../config/mongoose');
const FandomModal = require('../models/Fandom');
const FandomUserData = require('../models/UserData');
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
    let {FandomName,skip,limit,userEmail} = req.query, userData=[];
    let filters = req.body
    skip = Number(skip-1); limit = Number(limit);
    if(await Object.entries(filters).length===0 ){
        filters = null
    }else{
        filters = await getFiltersRules(filters);
        filters = Object.assign({}, ...filters[1]);
    }
    getFanfics(skip,limit,FandomName,filters).then(async fanfics=>{
        if(userEmail!='null'){
            userData = await checkForUserDataInDBOnCurrentFanfics(userEmail,fanfics)
            res.send([fanfics,userData])
        }else{
            res.send([fanfics,[]])
        }
    })
}
const getFanfics = async(skip,limit,fandomName,filters)=>{
    console.log(clc.bgGreenBright('[db controller] getFanfics()')); 
    console.log('filters:',filters)
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    return new Promise(function(resolve, reject) {
        FanficDB.find(filters).sort({['LastUpdateOfFic']: -1 , ['LastUpdateOfNote']: 1}).skip(Number(skip)).limit(Number(limit)).exec(async function(err, fanfics) {
            err && reject(err)
            resolve(fanfics)
        })
    });    
}

const checkForUserDataInDBOnCurrentFanfics = async (userEmail,fanfics)=>{
    console.log(clc.blue('[db controller] checkForUserDataInDBOnCurrentFanfics()'));
    // let {userEmail} = req.query;   
    // let {fanfics} = req.body;   

    let data=[];
    
    return new Promise(function(resolve, reject) {
        FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
            if (err) {  reject('there is an error'); }

            if (user) {
                console.log('found user!!, '+user.userEmail)
                fanfics.forEach(async function (fanfic){ 
                    let isExist = await user.FanficList.find(x => Number(x.FanficID) === Number(fanfic.FanficID));
                    if(isExist){
                        data.push(isExist)
                    }
                });
                 resolve(data)
                
            }else{
                console.log('didnt found user , no personal data yet!!')
                resolve([])
            }
        }) 
    });
} 

exports.addFanficToUserFavoritesInDB = async (req,res)=>{
    console.log(clc.blue('[db controller] addFanficToUserFavoritesInDB()'));
    let {userEmail,fanficId,favorite,fandomName} = req.query;

    var mongoObjectId = mongoose.Types.ObjectId(userEmail);
    console.log(mongoObjectId)
    FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
        if (err) { return 'there is an error'; }

        if (user) {
            console.log('found user!!, '+user.userEmail)
            let isExist = await user.FanficList.find(x => x.FanficID === Number(fanficId));
            console.log('isExist?, '+isExist)
            if(!isExist){
                console.log('not exist!!')
                user.FanficList.push({
                    FanficID: fanficId,
                    FandomName: fandomName,
                    Favorite: favorite                    
                });
                user.save();
                res.send(true);
            }else{
                console.log('exist!!')
                FandomUserData.updateOne(
                    { userEmail: userEmail , "FanficList.FanficID": fanficId },
                    { $set: {"FanficList.$.Favorite": favorite}},
                    (err, result) => {
                        if (err) throw err;
                        console.log('User updated!');
                     }
                 )
                res.send(true);
            }
        }else{
            console.log('didnt found user , creating new one!!')
            const newUser = new FandomUserData({
                userEmail: userEmail,
                FanficList: {
                    FanficID:         fanficId,
                    FandomName:       fandomName,
                    Favorite:         Boolean(favorite)   
                }
            });
            await newUser.save();
            res.send(true);
        }
    }) 
}
const getFiltersRules = async (filters) =>{
    let filtersUserList=[],filtersFanficList=[];
    await filters.map(filter=>{
        switch (filter) {
            case 'favorite':
                filtersUserList.push({'FanficList.Favorite':true})
                break;
            case 'deleted':
                filtersFanficList.push({'Deleted':true})
                break;
            case 'complete':
                filtersFanficList.push({'Complete':true})
                break;
        }
    })
    console.log('filtersUserList: ',filtersUserList)
    console.log('filtersFanficList: ',filtersFanficList)
    console.log('[filtersUserList,filtersFanficList]: ',[filtersUserList,filtersFanficList])
    return [filtersUserList,filtersFanficList]
}
exports.getFilteredFanficsListFromDB = async (req,res)=>{
    console.log(clc.blue('[db controller] getFanficsFromDB()'));
    let {fandomName,userEmail,pageLimit} = req.query, filters = req.body, promises=[],filtersArrays=[],flag;

    filtersArrays = await getFiltersRules(filters)

    if(filtersArrays[0].length!==0){

        const filterObj = Object.assign({'userEmail': userEmail},{'FanficList.FandomName':fandomName}, ...filtersArrays[0]);
        console.log('filterObj:',filterObj)
        // FandomUserData.find({'userEmail': userEmail}, async function(err, data) {
        FandomUserData.aggregate([{$unwind:"$FanficList"},{$match:filterObj},
                                  {$group :  {_id : {FandomName: "$FanficList.FandomName", FanficID: "$FanficList.FanficID"}} },
                                  {$project: { _id: 0,FandomName:'$_id.FandomName',FanficID:'$_id.FanficID'}}
                                 ], async function(err, filtered) {
            await filtered.map((fanfic, index) => promises.push(getOneFanficFromDB(fanfic.FanficID,fanfic.FandomName,filtersArrays[1])));
            Promise.all(promises).then(async filteredFanfics => {res.send([filteredFanfics,filteredFanfics.length])});
        })
    
    }else if(filtersArrays[1].length!==0){
        const filterObj = Object.assign({}, ...filtersArrays[1]);
        getFanfics(0,pageLimit,fandomName,filterObj).then(async fanfics=>{
            let resultsCounter = await mongoose.dbFanfics.collection(fandomName).countDocuments(filterObj);
            console.log('resultsCounter:',resultsCounter)
            res.send([fanfics,resultsCounter])
        }).catch(err=>res.send(err))
    }
    //filtersArrays[0].length!==0 && FandomUserData.findOne({userEmail: userEmail}, async function(err, data) {  
        // let filteredFanfics = await fandomName ? (data.FanficList.filter(fanfic => {
        //     // return(fanfic['Favorite']  && fanfic.FandomName === fandomName)
        //     filtersArrays[0].forEach(async function(filter) {
        //         var keys = Object.keys(filter);
        //         await keys.forEach(function(key) { 
        //             flag=false                   
        //             // console.log('this is a key-> ' + key + ' & this is its value-> ' + filter[key])
        //             // console.log('fanfic[key]' + fanfic[key] + ' & filter[key] ' + filter[key])
        //             if(fanfic[key] === filter[key] && fanfic.FandomName === fandomName){flag=true,console.log('1')}else{flag=false,console.log('2')}               
        //         });                          
        //     })
        //     return flag
        // })) : 
        // //TODO: work on it
        // (data.FanficList.filter( fanfic => {return fanfic.Favorite === true}))
        // //TODO: add filters with both user anf fanfic to: getOneFanficFromDB()
        // await filteredFanfics.map((fanfic, index) => promises.push(getOneFanficFromDB(fanfic.FanficID,fanfic.FandomName,filters)));
        // Promise.all(promises).then(async filteredFanfics => {res.send(filteredFanfics)});
        


    //}); 
    //TODO: search for all

} 

const getOneFanficFromDB = (fanficId,fandomName,filters) =>{
    console.log(clc.bgGreenBright('[db controller] getOneFanficFromDB()'));  
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    return new Promise(function(resolve, reject) {
        FanficDB.find({FanficID:fanficId}).exec(async function(err, fanfic) { 
            err && reject(err);
            resolve(fanfic[0])
        });
    });
}