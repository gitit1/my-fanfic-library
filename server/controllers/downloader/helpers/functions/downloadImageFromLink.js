const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.downloadImageFromLink = async (url, filename) => {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFile(filename, buffer, () => console.log('finished downloading image!'));  
};