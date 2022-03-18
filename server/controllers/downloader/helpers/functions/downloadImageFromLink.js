const download = require('image-downloader');
const clc = require("cli-color");

exports.downloadImageFromLink = async(url, filename) => {
  return await new Promise(async function (resolve, reject) {
    download.image({
      url,
      dest: filename 
   }).then(() => {
      console.log(clc.green('Saved image!'));
      resolve(true);
    })
    .catch((error) => {
      console.log(clc.red('failed to download image'), error);
      reject(false);
    })
  });
}
// const fs = require('fs');
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// exports.downloadImageFromLink = async (url, filename) => {
//   const response = await fetch(url);
//   const buffer = await response.buffer();
//   fs.writeFile(filename, () => console.log('finished downloading image!'));  
// };