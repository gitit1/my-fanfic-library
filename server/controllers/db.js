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
            if(isImage){
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
            "AutoSave":                 (req.body.AutoSave === 'true') ? true : false,
            "SaveMethod":               req.body.SaveMethod,
            "FanficsInFandom":          Number(req.body.FanficsInFandom),
            "OnGoingFanfics":           Number(req.body.OnGoingFanfics),
            "CompleteFanfics":          Number(req.body.CompleteFanfics),
            "SavedFanfics":             Number(req.body.SavedFanfics),
            "LastUpdate":               Date.now(),
            "Image_Name":               imageName,
            "Image_Path":               req.body.FandomName
        }
        if(req.body.AutoSave === 'true'){
            fs.mkdirSync(pathForImage+fandomName+'/Fanfics',{recursive: true});
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
    let {FandomName,skip,limit,userEmail} = req.query, userData=[],ignoreList;
    skip = Number(skip); limit = Number(limit);
    const sort=null;

    ignoreList = await getIgnoredList(userEmail);
    const filters = (ignoreList.length>0) ? { FanficID : { $nin: ignoreList }} : null;
    // const filters = null;
    getFanfics(skip,limit,FandomName,filters,sort).then(async fanfics=>{
        if(userEmail!='null'){
            userData = await checkForUserDataInDBOnCurrentFanfics(userEmail,fanfics)
            res.send([fanfics,userData,ignoreList.length])
        }else{
            res.send([fanfics,[],0])
        }
    })
}
const getIgnoredList = (userEmail) =>{
    return new Promise(function(resolve, reject) {
        FandomUserData.findOne({userEmail: userEmail}, async function(err, user) { 
            if (err) {  
                console.log('there is an error in getIgnoredList()')
                reject([]); 
            }    
            if (user) {
                resolve(user.FanficIgnoreList);
            }else{
                resolve([])
            }
        });
    });
}
const getFanfics = async(skip,limit,fandomName,filters,sortObj)=>{
    console.log(clc.bgGreenBright('[db controller] getFanfics()')); 
    console.log('sort 2:',sortObj)
    sort = (sortObj===null) ? {['LastUpdateOfFic']: -1 , ['LastUpdateOfNote']: 1} : sortObj
    console.log('sort 3:',sort)
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    console.log('filters:',filters)
    return new Promise(function(resolve, reject) {
        FanficDB.find(filters).sort(sort).skip(Number(skip)).limit(Number(limit)).exec(async function(err, fanfics) {
            err && reject(err)
            resolve(fanfics)
        })
    });    
}

exports.addFanficToUserMarksInDB = async (req,res)=>{
    console.log(clc.blue('[db controller] addFanficToUserFavoritesInDB()'));
    let {userEmail,fanficId,fandomName,markType,mark} = req.query,saveAs;

    FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
        if (err) { return 'there is an error'; }
        console.log('markType:',markType)
        console.log('mark:',mark)
        if (user) {


            console.log('found user!!, '+user.userEmail)
            let isExist = await user.FanficList.find(x => x.FanficID === Number(fanficId));
            // console.log('isExist?, '+isExist)
            if(!isExist){
                console.log('not exist!!')
                user.FanficList.push({
                    FanficID: fanficId,
                    FandomName: fandomName,
                    [markType]: Boolean(mark)                     
                });
                if(markType=='Ignore' && mark){
                    user.FanficIgnoreList.push(fanficId);
                }
                // }else if(markType=='Ignore' && !mark){
                //     let newArray = user.FanficIgnoreList.filter(x => {return x === fanficId;})
                //     user.FanficIgnoreList = newArray;
                // }
                user.save();
                res.send(true);
            }else{
                //TODO: function to clean "empty" userdata in userdataDb (if all settings are init not needed)
                switch (markType) {
                    case 'Favorite':
                        saveAs = {"FanficList.$.Favorite":mark}
                        break;
                    case 'Ignore':           
                        if(markType==='Ignore' && mark==='true'){
                            saveAs = { $set: {"FanficList.$.Ignore":mark}, $push: {"FanficIgnoreList":fanficId} }
                        }else if(markType==='Ignore' && mark==='false'){
                            saveAs = {$set: {"FanficList.$.Ignore":mark}, $pull: {"FanficIgnoreList":fanficId} }
                        }
                        break;
                }

                console.log('exist!!')
                console.log('saveAs:',saveAs)
                FandomUserData.updateOne(
                    { userEmail: userEmail , "FanficList.FanficID": fanficId },saveAs,(err, result) => {
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
                    [markType]:       Boolean(mark)   
                },
                FanficIgnoreList: (markType=='Ignore' && mark) && fanficId
            });
            await newUser.save();
            res.send(true);
         }
    }) 
}
exports.addFanficToUserStatus = async (req,res)=>{
    console.log(clc.blue('[db controller] addFanficToUserStatus()'));
    let {userEmail,fanficId,fandomName,statusType,status,data} = req.query;
    console.log('userEmail:',userEmail)
    console.log('fanficId:',fanficId)
    console.log('fandomName:',fandomName)
    console.log('statusType:',statusType)
    console.log('status:',status)
    console.log('data:',data)

    FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
        if (err) { return 'there is an error'; }

        if (user) {
            console.log('found user!!, '+user.userEmail)
            let isExist = await user.FanficList.find(x => x.FanficID === Number(fanficId));
            // console.log('isExist?, '+isExist)
            if(!isExist){
                console.log('not exist!!')
                user.FanficList.push({
                    FanficID: fanficId,
                    FandomName: fandomName,
                    Status: status,
                    ChapterStatus: (data!==undefined) ? Number(data) : undefined                 
                });
                user.save();
                res.send(true);
            }else{
                console.log('exist!!')
                FandomUserData.updateOne(
                    { userEmail: userEmail , "FanficList.FanficID": fanficId },
                    { $set: {"FanficList.$.Status": status,"FanficList.$.ChapterStatus": (data!==undefined)?Number(data):undefined }},
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
                    Status:           status,
                    ChapterStatus: (data!==undefined) ? Number(data) : undefined   
                }
            });
            await newUser.save();
            res.send(true);
        }
    }) 

}
exports.getFilteredFanficsListFromDB = async (req,res)=>{
    console.log(clc.blue('[db controller] getFanficsFromDB()'));
    let {fandomName,userEmail,pageLimit,pageNumber} = req.query, filters = req.body,filtersArrays=[],flag;

    filtersArrays = await getFiltersRules(filters,userEmail)//[0] - userData filters , [1] - fanfics filters, [2] - sort 
    sortObj = Object.assign({}, ...filtersArrays[2]);
    console.log('sortObj:',sortObj)

    if(filtersArrays[2].length!==0 && filtersArrays[0].length===0 && filtersArrays[1].length===0){
        let filteredFanficsData = await getFilteredFanficsHandler(userEmail,fandomName,{},sortObj,pageLimit,pageNumber)
        res.send([filteredFanficsData[0],filteredFanficsData[1],filteredFanficsData[2]])
    }else if(filtersArrays[0].length!==0){
        let filteredData = await userDataFiltersHandler(userEmail,fandomName,filtersArrays,sortObj,pageLimit,pageNumber);
        res.send([filteredData[0],filteredData[1],filteredData[2]])
    }else if(filtersArrays[1].length!==0){
        const filterObj = Object.assign({}, ...filtersArrays[1]);
        let filteredFanficsData = await getFilteredFanficsHandler(userEmail,fandomName,filterObj,sortObj,pageLimit,pageNumber)
        res.send([filteredFanficsData[0],filteredFanficsData[1],filteredFanficsData[2]])
    }
}
const getFiltersRules = async (filters,userEmail) =>{
    let filtersUserList=[],filtersFanficList=[],sortList=[],wordsFlag=false;
    const ignoreList = await getIgnoredList(userEmail);
    (ignoreList.length>0) &&  filtersFanficList.push({ FanficID : { $nin: ignoreList }})

    console.log('filters:::',filters)
    await filters.map(filter=>{
        let filterKey = filter.split('_')[0]
        let filterValue = filter.split('_').pop()
        console.log('filterKey:',filterKey)
        switch (filterKey) {
            //User Data Filters:
            case 'favorite':
                filtersUserList.push({'FanficList.Favorite':true})
                break;
            //Fanfic Filters:
            case 'deleted':
                filtersFanficList.push({'Deleted':true})
                break;
            case 'complete':
                filtersFanficList.push({'Complete':true})
                break;
            case 'wip':
                filtersFanficList.push({'Complete':false})
                break;
            case 'oneShot':
                filtersFanficList.push({'Oneshot':true})
                break;
            //Sort Filters:
            case 'hits':
                sortList.push({'Hits':-1})
                break; 
            case 'kudos':
                sortList.push({'Kudos':-1})
                break; 
            case 'bookmarks':
                sortList.push({'Bookmarks':-1})
                break;              
            case 'comments':
                sortList.push({'Comments':-1})
                break;
            case 'title':
                filtersFanficList.push({'FanficTitle': {$regex : `.*${filterValue}.*`, '$options' : 'i'}})
                break;
            case 'author':
                filtersFanficList.push({'Author': {$regex : `.*${filterValue}.*`, '$options' : 'i'}})
                break;
            case 'wordsFrom':
                    if(wordsFlag){
                        index = filtersFanficList.findIndex(x => x.Words)
                        filtersFanficList[index].Words = Object.assign(filtersFanficList[index].Words,{$gte: Number(filterValue)})
                    }else{
                        filtersFanficList.push({'Words':{$gte: Number(filterValue)}})
                        sortList.push({'Words':-1})
                        wordsFlag = true;
                    }
                    break;                                            
            case 'wordsTo':
                    if(wordsFlag){
                        index = filtersFanficList.findIndex(x => x.Words)
                        filtersFanficList[index].Words = Object.assign(filtersFanficList[index].Words,{$lte: Number(filter.split('_').pop())})
                    }else{
                        filtersFanficList.push({'Words':{$lte: Number(filter.split('_').pop())}})
                        sortList.push({'Words':-1})
                        wordsFlag = true;
                    }
                    break;                              
        }
    })


    console.log('filtersUserList: ',filtersUserList)
    console.log('filtersFanficList: ',filtersFanficList)

    console.log('[filtersUserList,filtersFanficList]: ',[filtersUserList,filtersFanficList,sortList])
    return [filtersUserList,filtersFanficList,sortList]
    

}
const userDataFiltersHandler = (userEmail,fandomName,filtersArrays,sortObj,pageLimit,pageNumber) =>{
    console.log(clc.bgGreenBright('[db controller] userDataFiltersHandler()')); 
    return new Promise(function(resolve, reject) {
        try {
            //USER DATA FILTERS:
            let idsList=[]
            const filterObj = Object.assign({'userEmail': userEmail},{'FanficList.FandomName':fandomName}, ...filtersArrays[0]);

            // FandomUserData.find({'userEmail': userEmail}, async function(err, data) {
            FandomUserData.aggregate([{$unwind:"$FanficList"},{$match:filterObj},
                                    {$group :  {_id : {FandomName: "$FanficList.FandomName", FanficID: "$FanficList.FanficID"}} },
                                    {$project: { _id: 0,FandomName:'$_id.FandomName',FanficID:'$_id.FanficID'}}
                                    ], async function(err, filtered) {
                                        pageLimit = Number(pageLimit), pageNumber = Number(pageNumber)
                                        filtered.map(fanfic => idsList.push(fanfic.FanficID));
                                        // let initSkip = (pageLimit*pageNumber)-pageLimit;
                                        console.log('idsList:',idsList)
                                        const filterObj = Object.assign({FanficID: {$in: idsList}}, ...filtersArrays[1]);
                                        let filteredData = await getFilteredFanficsHandler(userEmail,fandomName,filterObj,sortObj,pageLimit,pageNumber)
                                        resolve(filteredData)
            })       
        } catch (error) {
            reject(error) 
        }
    });

}
const getFilteredFanficsHandler = (userEmail,fandomName,filterObj,sortObj,pageLimit,pageNumber) =>{
    console.log(clc.bgGreenBright('[db controller] fanficsDataFiltersHandler()')); 
    return new Promise(function(resolve, reject) {
        try {           
            let skip = (pageLimit*pageNumber)-pageLimit;
            getFanfics(skip,pageLimit,fandomName,filterObj,sortObj).then(async filteredFanfics=>{
                let resultsCounter = await mongoose.dbFanfics.collection(fandomName).countDocuments(filterObj);
                let userData = await checkForUserDataInDBOnCurrentFanfics(userEmail,filteredFanfics)
                resolve([filteredFanfics,userData,resultsCounter])
            }).catch(err=>reject(err))    
        } catch (error) {
            reject(error) 
        }
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

/* OLD - NOT IN USE */
const MixedFiltersHandler = async (userEmail,fandomName,filtersArrays,pageLimit,pageNumber) =>{
    console.log(clc.bgGreenBright('[db controller] MixedFiltersHandler()')); 

    let filteredUserData = await userDataFiltersHandler(userEmail,fandomName,filtersArrays[0],0,0);

    // console.log('filteredUserData[0].length: ',filteredUserData[0].length)
    // let filteredFanficsData = await fanficsDataFiltersHandler(userEmail,fandomName,filtersArrays[1],0,0)

    // var filteredFanfics = await compare(filteredUserData[0], filteredFanficsData[0]);
    // let userData = await checkForUserDataInDBOnCurrentFanfics(userEmail,filteredFanfics)
    // console.log('filteredList.length:',filteredFanfics.length)
    // return([filteredFanfics,userData,filteredFanfics.length])
    
}
const getOneFanficFromDB = (fanficId,fandomName,filters) =>{  
    console.log(clc.bgGreenBright('[db controller] getOneFanficFromDB()'));  
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    const filterObj = Object.assign({FanficID:fanficId}, ...filters);
    return new Promise(function(resolve, reject) {
        FanficDB.find(filterObj).exec(async function(err, fanfic) { 
            err && reject(err);
            resolve(fanfic[0])
        });
    });
}

function compare() {
    console.log(clc.bgGreenBright('[db controller] compare()'));  
	let arr = [...arguments]
	// console.log('arr:',arr)
	return arr.shift().filter( y => 
  	arr.every( x => x.some( j => j.FanficID === y.FanficID) )
  )
}