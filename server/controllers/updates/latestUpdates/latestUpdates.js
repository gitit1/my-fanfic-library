
const mongoose = require('../../../config/mongoose');
const FanficSchema = require('../../../models/Fanfic');
const moment = require('moment');
const pLimit = require('p-limit');

let data = [];

exports.latestUpdates = async (fandom) =>{ 
    let promises=[];
    // const today = new Date().getTime();
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandom);

    for(let i=2; i<=3; i++){
        console.log('1')
        const day = new Date(moment().subtract(i-1, 'day')).getTime();// 1 2
        const dayBFR = new Date(moment().subtract(i, 'day')).getTime(); // 2 3
        const limit = pLimit(1)
        promises.push(limit(() => getDataOfFanficsBetweenDays(FanficDB,day,dayBFR)));
    }

    return await Promise.all(promises).then(fanfics=> {
        console.log('3')
        return data;  
    })
    // console.log('weekAgo:',weekAgo)
    // console.log('weekAgo:',new Date(weekAgo).getTime())

}

const getDataOfFanficsBetweenDays = (FanficDB,day,dayBFR) =>{
    console.log('2')
    return new Promise(function(resolve, reject) {
        date = new Date(day).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'});
        FanficDB.find({"LastUpdateOfFic": {$gte : dayBFR, $lte : day}}).exec(async function(err, fanfics) {
            // console.log('fanfics:',fanfics)
            err && reject(err);
            let newFan=[];
            await fanfics.map(fanfic=>{
                newFan.push([fanfic.FanficID,fanfic.Source,fanfic.Status,fanfic.StatusDetails])
            })
            data.push({[date]:newFan});
            resolve();
            // resolve(day,fanfics)
        })
    }); 
}