const cron = require('node-cron');
const axios = require('axios');

const getFanfics = require('../controllers/db/db');
 
//Frequency: At 01:00 on every day-of-week from Sunday through Sunday. (https://crontab.guru/)
cron.schedule('0 1 * * 0-7', () => {
  console.log('CronJob Awoke: [Get Fanfics of all fandoms]');
    getFanfics.manageDownloader(null,'All')

});