
const clc = require("cli-color");
let request = require('request');
const {sleep} = require('../../../helpers/sleep.js')

exports.getUrlBodyFromAo3 = (jar,url) =>{
    return new Promise(function(resolve, reject) {
        request.get({url,jar, credentials: 'include'}, async function (err, httpResponse, body) {
            if(err){  
                console.log(clc.red('Error in getUrlBodyFromAo3()',err))          
                console.log(clc.red('URL:',url))          
                reject(false)
            }else if(body.includes("Retry later")){
                console.log('failed to connect - sleeping and tring again')
                log.info(`----- failed to connect - sleeping and tring again`);
                sleep(9000)
                log.info(`----- failed to connect - tring again`);
                getUrlBodyFromAo3(jar,url)
            }else{
                console.log('getUrlBodyFromAo3:',url)
                resolve(body) 
            }       
        });
    });
}