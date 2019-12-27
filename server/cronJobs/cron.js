const cron = require('node-cron');
const clc = require("cli-color");

const getFanfics = require('../controllers/connection/connection');
 
//Frequency: At 02:00 on every day-of-week from Sunday through Thusday. (https://crontab.guru/)
cron.schedule('0 2 * * sun-thu', () => {
    console.log(clc.bgRed('CronJob Awoke: [Get Fanfics of all fandoms - Partial Run]'));
    getFanfics.manageDownloader(null,'All','getFandomFanficsPartial','partial')
});

//At 1:00 on Friday.
cron.schedule('0 1 * * fri', async ()=>{
    console.log(clc.bgRed('CronJob Awoke: [Get Fanfics of all fandoms - Partial  Run]'));
    await getFanfics.manageDownloader(null,'All','getFandomFanficsPartial','partial');
    console.log(clc.bgRed('CronJob Awoke: [Get Deleted Fanfics of all fandoms]'));
    await getFanfics.manageDownloader(null,'All','getDeletedFanfics');   
})

//At 1:00 on Saturday.
cron.schedule('0 23 * * sat', async ()=>{
    console.log(clc.bgRed('CronJob Awoke: [Get Fanfics of all fandoms - Full run]'));
    await getFanfics.manageDownloader(null,'All','getFandomFanficsPartial','full');   
})

//TODO: ARCHIVE LATESTUPDATE - IF COUNT > LIMIT - TAKE THE EXTRA TO ARCHIVE BY MONTH;