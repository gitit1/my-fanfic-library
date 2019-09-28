const clc = require("cli-color");

const {checkForUserDataInDBOnCurrentFanfics} = require('../../helpers/checkForUserDataInDBOnCurrentFanfics')
const {getFanfics} = require('../../helpers/getFanfics')
const {getIgnoredList} = require('../../helpers/getIgnoredList');
const {getReadingLists} = require('../../helpers/getReadingLists');

exports.getFanficsFromDB = async (req,res) =>{
    console.log(clc.blue('[db controller] getFanficsFromDB()'));
    let {FandomName,skip,limit,userEmail} = req.query, userData=[],ignoreList;
    skip = Number(skip); limit = Number(limit);
    const sort=null;

    ignoreList = await getIgnoredList(FandomName,userEmail);
    readingLists = await getReadingLists(userEmail);
    const filters = (ignoreList.length>0) ? { FanficID : { $nin: ignoreList }} : null;
    // const filters = null;
    getFanfics(skip,limit,FandomName,filters,sort).then(async fanfics=>{
        if(userEmail!='null'){
            userData = await checkForUserDataInDBOnCurrentFanfics(userEmail,fanfics)
            res.send([fanfics,userData,readingLists[0],ignoreList.length])
        }else{
            res.send([fanfics,[],[],0])
        }
    })
}

