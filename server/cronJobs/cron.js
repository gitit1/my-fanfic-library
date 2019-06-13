const cron = require('node-cron');
const axios = require('axios');

const test = require('../controllers/db/db');
 
cron.schedule('*/55 * * * * *', () => {
  console.log('running a task every minute');
    fandoms = []
    axios.get(`https://my-fanfic-lybrare.firebaseio.com/fandoms.json`).then(res=>{
        // console.log(res.data[0])
        for(let key in res.data){
            fandoms.push(res.data[key]);
        }

        test.test(null,{
            name:'Cazzie',
            keys:'Casey Gardner/Izzie'
        })

    } ).catch(error => {
        console.log(error.message)
    })


});