const cron = require('node-cron');
const clc = require("cli-color");

const getFanfics = require('../controllers/connection/connection');
const { backupDB } = require('../controllers/db/Backup/backupDB')
 
console.log('in cron file!!')
//Frequency: At 02:00 on every day-of-week from Sunday through Thusday. (https://crontab.guru/)
//cron.schedule('0 2 * * sun-thu', () => {
cron.schedule('0 2 * * sun-sat', () => {
    console.log(clc.bgRed('CronJob Awoke: [Get Fanfics of all fandoms - Partial Run]'));
    getFanfics.manageDownloader(null,'All','getFandomFanficsPartial','cron',true,true)
});
/*
// //At 1:00 on Friday.
cron.schedule('0 1 * * fri', async ()=>{
    console.log(clc.bgRed('CronJob Awoke: [Get Fanfics of all fandoms - Partial  Run]'));
    await getFanfics.manageDownloader(null,'All','getFandomFanficsPartial','cron',true,true);
    // console.log(clc.bgRed('CronJob Awoke: [Get Deleted Fanfics of all fandoms]'));
    // await getFanfics.manageDownloader(null,'All','getDeletedFanfics','cron');   
})

// //At 1:00 on Saturday.
cron.schedule('0 23 * * sat', async ()=>{
    console.log(clc.bgRed('CronJob Awoke: [Get Fanfics of all fandoms - Partial run]'));
    await getFanfics.manageDownloader(null,'All','getFandomFanficsPartial','cron',true,true);   
})

cron.schedule('0 20 * * sat', async ()=>{
    console.log(clc.bgRed('CronJob Awoke: [backupDB]'));
    await backupDB();
});
*/

//TODO: ARCHIVE LATESTUPDATE - IF COUNT > LIMIT - TAKE THE EXTRA TO ARCHIVE BY MONTH;