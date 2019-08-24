const clc = require("cli-color");

const mongoose = require('../../../config/mongoose.js');
const FanficSchema = require('../../../models/Fanfic');

const {checkForUserDataInDBOnCurrentFanfics} = require('../helpers/checkForUserDataInDBOnCurrentFanfics')
const {getFanfics} = require('../helpers/getFanfics')
const {getIgnoredList} = require('../helpers/getIgnoredList');

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

