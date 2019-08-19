const clc = require("cli-color");

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});

exports.getUrlBodyFromSite = url =>{
    console.log('getUrlBodyFromSite')

    return new Promise(function(resolve, reject) {
        request.get({url,jar,gzip: true,credentials: 'include'}, function (err, httpResponse, body) {
            if(err){  
                console.log(clc.red('Error in getUrlBodyFromSite()',err))                  
                reject(false)
            }else{
                resolve(httpResponse.body)
            }        
        });
    });
}