const fs = require('fs');
const fetch = require('node-fetch');

exports.downloadImageFromLink = async (url, filename) => {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFile(filename, buffer, () => console.log('finished downloading image!'));  
};