
const clc = require("cli-color");
const cheerio = require('cheerio');
let request = require('request');
const {sleep} = require('../../../helpers/sleep.js')

exports.getUrlBodyFromAo3 = async (jar,url,log) =>{
    return getUrlBody(jar,url,log)
}

const getUrlBody = (jar,url,log) =>{
    return new Promise(function(resolve, reject) {
        request.get({url,jar, credentials: 'include'}, async function (err, httpResponse, body) {
            // console.log('body', body)
            let $ = cheerio.load(body);
            if(err){  
                console.log(clc.red('Error in getUrlBodyFromAo3()',err))          
                console.log(clc.red('URL:',url))          
                reject(false)
            }else if(body.includes("Retry later") || !($('body').hasClass('logged-in'))){
                console.log('failed to connect - sleeping and tring again',url)
                log && log.info(`----- failed to connect - sleeping and tring again`,url);
                await sleep(10000)
                resolve(getUrlBody(jar,url,log))  
            }else{
                console.log('getUrlBodyFromAo3:',url)
                resolve(body);
            }       
        });
    });
}