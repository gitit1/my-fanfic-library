
const clc = require("cli-color");
let request = require('request');

exports.getUrlBodyFromAo3 = (jar,url) =>{
    return new Promise(function(resolve, reject) {
        // request = request.defaults({jar: jar,followAllRedirects: true});
        console.log('getUrlBodyFromAo3:',url)
        request.get({url,jar, credentials: 'include'}, function (err, httpResponse, body) {
            if(err){  
                console.log(clc.red('Error in getUrlBodyFromAo3()',err))          
                console.log(clc.red('URL:',url))          
                reject(false)
            }else{
                resolve(body)
            }        
        });
    });
}