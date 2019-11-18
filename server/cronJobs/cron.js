const cron = require('node-cron');
const clc = require("cli-color");

const getFanfics = require('../controllers/connection/connection');
 
//Frequency: At 02:00 on every day-of-week from Sunday through Sunday. (https://crontab.guru/)
cron.schedule('0 2 * * *', () => {
    console.log(clc.bgRed('CronJob Awoke: [Get Fanfics of all fandoms]'));
    getFanfics.manageDownloader(null,'All','All',false)
});


//TODO: ARCHIVE LATESTUPDATE - IF COUNT > LIMIT - TAKE THE EXTRA TO ARCHIVE BY MONTH;