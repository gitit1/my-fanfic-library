const cron = require('node-cron');
const clc = require("cli-color");

const getFanfics = require('../controllers/connection');
 
//Frequency: At 01:00 on every day-of-week from Sunday through Sunday. (https://crontab.guru/)
cron.schedule('0 1 * * *', () => {
  console.log(clc.bgRed('CronJob Awoke: [Get Fanfics of all fandoms]'));
    getFanfics.manageDownloader(null,'All')
});