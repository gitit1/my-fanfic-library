const clc = require("cli-color");

const {checkForUserDataInDBOnCurrentFanfics} = require('../../helpers/checkForUserDataInDBOnCurrentFanfics')
const {getFanfics} = require('../../helpers/getFanfics')
const {getIgnoredList} = require('../../helpers/getIgnoredList');
const {getReadingLists} = require('../../helpers/getReadingLists');

exports.getFanficsFromDB = async (req,res) =>{
    console.log(clc.blue('[db controller] getFanficsFromDB()'));
    let {FandomName,skip,limit,userEmail,list} = req.query, userData=[],ignoreList;
    skip = Number(skip); limit = Number(limit);
    const sort=null;

    ignoreList = await getIgnoredList(FandomName,userEmail);
    readingLists = await getReadingLists(userEmail);
    let filters = {},readingList = null;
    
    if(list==='true'){
        console.log('readingLists:',readingLists)
        readingList = readingLists[1].find(f => {
            return f.Name === FandomName;
        });
        console.log('readingList:',readingList)
        filters = (ignoreList.length>0) ? {FanficID : { $in: readingList.Fanfics}} : { FanficID : { $nin: ignoreList } , FanficID : { $in: readingList.Fanfics}}
    }else{
        filters = (ignoreList.length>0) ? { FanficID : { $nin: ignoreList }} : null;
    }
    console.log('list:',list)
    console.log('filters 2:',filters)

    // const filters = null;
    getFanfics(skip,limit,FandomName,filters,sort,list,readingList).then(async fanfics=>{
        if(userEmail!='null'){
            userData = await checkForUserDataInDBOnCurrentFanfics(userEmail,fanfics)
            res.send([fanfics,userData,readingLists[0],ignoreList.length])
        }else{
            res.send([fanfics,[],[],0])
        }
    })
}

