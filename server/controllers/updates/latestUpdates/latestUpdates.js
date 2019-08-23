
const mongoose = require('../../../config/mongoose');
const FanficSchema = require('../../../models/Fanfic');
const moment = require('moment');

const pLimit = require('p-limit');
const limit = pLimit(20);

// exports.latestUpdates = async (fandoms) =>{ 
//     let data = [];
//     for(let i=1; i<=5; i++){
//         const day = new Date(moment().subtract(i-1, 'day')).getTime();// 1 2
//         const dayBFR = new Date(moment().subtract(i, 'day')).getTime(); // 2 3

//         let fandomData = await getLatestUpdatesOfFandom(fandoms,day,dayBFR)

//         let date = new Date(day).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'});
//         data.push({[date]:fandomData})
//     }
//     return data;
// }
// const getLatestUpdatesOfFandom = (fandoms,day,dayBFR) =>{
//     return new Promise(async function(resolve, reject) {
//         let fandomData=[],promises=[];
//         await fandoms.forEach(async fandomName=>{
//             promises.push(limit(() => getFanficUpdateData(fandomName,day,dayBFR)));
//         });

//         await Promise.all(promises).then(fanficsData=> {  
//             console.log('fanficsData 1:',fanficsData)     
//             resolve(fanficsData);
//         })
        
//     });
// }

// const getFanficUpdateData = (fandomName,day,dayBFR) =>{
//     return new Promise(async function(resolve, reject) {
//         let promises=[];
//         const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
//         promises.push(limit(() => getDataOfFanficsBetweenDays(FanficDB,day,dayBFR)));

//         await Promise.all(promises).then(fanficsData=> {  
//             console.log('fanficsData 2:',fanficsData)                    
//             resolve({[fandomName]:fanficsData[0]}); 
//         })
//     });
// }

// const getDataOfFanficsBetweenDays = (FanficDB,day,dayBFR) =>{
//     return new Promise(function(resolve, reject) {
//         FanficDB.find({"LastUpdateOfFic": {$gte : dayBFR, $lte : day}}).exec(async function(err, fanfics) {
//             err && reject(err);
//             let newFan=[],newCount=0,updateCount=0;
//             await fanfics.map(fanfic=>{
//                 if(fanfic.Status==='updated'||fanfic.Status==='new'){
//                     newFan.push({FanficID:fanfic.FanficID,
//                                  Source:fanfic.Source,
//                                  Status:fanfic.Status,
//                                  StatusDetails:fanfic.StatusDetails});
//                     fanfic.Status==='new' ? newCount++ : updateCount++;
//                 }
//             })

//             if(newFan.length>0){
//                 resolve([newFan,newCount,updateCount]);
//             }else{
//                 resolve(null);
//             }
            
//             // resolve(day,fanfics)
//         })
//     }); 
// }