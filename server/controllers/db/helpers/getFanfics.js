const clc = require("cli-color");
const mongoose = require('../../../config/mongoose');
const FanficSchema = require('../../../models/Fanfic');
const pLimit = require('p-limit');

exports.getFanfics = (skip,limit,fandomName,filters,sortObj,list,readingList)=>{
    return new Promise(async function(resolve, reject) {
        skip = (Number(skip)<0) ? 0 : Number(skip)
        limit = (Number(limit)<0) ? 0 : Number(limit) 
        let promises = [];
        const limitPromise = pLimit(1)
        console.log(clc.bgGreenBright('[db controller] getFanfics()')); 
        console.log('sort 2:',sortObj)
        sort = (sortObj===null) ? {['LastUpdateOfFic']: -1 , ['LastUpdateOfNote']: 1} : sortObj
        console.log('sort 3:',sort)
        
        console.log('filters:',filters)

        if(list==='true'){
            // console.log('readingList:',readingList.FanficsFandoms.readingList.Fanfics)
            readingList.FanficsFandoms.map(async fandom => {
                console.log('fandomName:',fandom)
                const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandom);
                //const fanfics1 = await getFanficsofFandoms(FanficDB,filters,0,0)
                // promises.push(limitPromise(() => {getFanficsofFandoms(FanficDB,filters,0,0) }));
                promises.push(getFanficsofFandoms(FanficDB,filters,0,0));
             });

            await Promise.all(promises).then(async fanfics=> {
                // console.log('fanfics:',fanfics)
                let arrfanfics = await fanfics.reduce(function(arr, e) {return arr.concat(e)})
                console.log('skip 1:',fanfics)
                console.log('skip 1:',skip)
                console.log('arrfanfics:',arrfanfics)
                console.log('limit+skip 1:',limit+skip)
                arrfanfics = await arrfanfics.slice(skip, limit+skip)
                resolve(arrfanfics)
            });
                
        }else{

            const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
            fanfics = await getFanficsofFandoms(FanficDB,filters,skip,limit)
            resolve(fanfics)
        } 
    }); 
}

const getFanficsofFandoms = (FanficDB,filters,skip,limit) =>{
    return new Promise(function(resolve, reject) {
        FanficDB.find(filters).sort(sort).skip(skip).limit(limit).exec(async function(err, fanfics) {
            err && reject(err)
            resolve(fanfics)
        })
    });     
}