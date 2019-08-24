const clc = require("cli-color");
const mongoose = require('../../../config/mongoose');
const FanficSchema = require('../../../models/Fanfic');

exports.getFanfics = async(skip,limit,fandomName,filters,sortObj)=>{
    skip = (Number(skip)<0) ? 0 : Number(skip)
    limit = (Number(limit)<0) ? 0 : Number(limit) 
    console.log(clc.bgGreenBright('[db controller] getFanfics()')); 
    console.log('sort 2:',sortObj)
    sort = (sortObj===null) ? {['LastUpdateOfFic']: -1 , ['LastUpdateOfNote']: 1} : sortObj
    console.log('sort 3:',sort)
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    console.log('filters:',filters)
    return new Promise(function(resolve, reject) {
        FanficDB.find(filters).sort(sort).skip(skip).limit(limit).exec(async function(err, fanfics) {
            err && reject(err)
            resolve(fanfics)
        })
    });    
}