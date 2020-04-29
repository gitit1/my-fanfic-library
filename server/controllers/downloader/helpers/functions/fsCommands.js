const clc = require("cli-color");
const fs = require('fs');

exports.saveFileToServer = (oldPath, newPath) => {
    console.log(clc.blue('[FS Commands] saveFileToServer()'));

    return new Promise(async function (resolve, reject) {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {reject(console.log('saveFileToServer err:',err))} 
            resolve(true)
        });
    }).catch((error) => {
        return false;
     });
}

exports.deleteFile = (path) => {
    console.log(clc.blue('[FS Commands] deleteFile()'));

    return new Promise(async function (resolve, reject) {
        fs.unlink(path,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
        }); 
        resolve();
    }).catch((error) => {
        return false;
    });
  };

exports.deleteFolderRecursive = (path) => {
    console.log(clc.blue('[FS Commands] deleteFile()'));
    
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = Path.join(path, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };