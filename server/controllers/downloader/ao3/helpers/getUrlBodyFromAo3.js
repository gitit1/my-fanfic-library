
const clc = require("cli-color");
let request = require('request');

let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});

exports.getUrlBodyFromAo3 = url =>{
    return new Promise(function(resolve, reject) {
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