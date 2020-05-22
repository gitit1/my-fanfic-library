const fs = require('fs');
const request = require('request');


exports.downloadImageFromLink = async (uri, filename, callback) => {
    console.log()
    await new Promise(async function(resolve, reject) {
        request.head(uri, function(err, res, body){
      
          request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
        resolve();
    });
};