const cron = require('node-cron');
const axios = require('axios');

const getFanfics = require('../controllers/db/db');
 
//change frequency: once a night
cron.schedule('*/55 * * * * *', () => {
  console.log('running a task every minute');
    // fandoms = []
    // axios.get(`https://my-fanfic-lybrare.firebaseio.com/fandoms.json`).then(res=>{

    //     for(let key in res.data){
    //         fandoms.push(res.data[key]);
    //     }

    //     getFanfics.manageDownloader(null,'All')

    // } ).catch(error => {
    //     console.log(error.message)
    // })
    getFanfics.manageDownloader(null,'All')

});