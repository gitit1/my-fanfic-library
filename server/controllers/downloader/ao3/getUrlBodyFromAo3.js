// server/controllers/downloader/ao3/getUrlBodyFromAo3.js
const clc = require('cli-color');
const { ao3Request: AO3 } = require('../../../helpers'); // via helpers index

exports.getUrlBodyFromAo3 = async (jar, url, log) => {
  try {
    const body = await AO3.getPage(jar, url, { log });
    return body;
  } catch (err) {
    console.log(clc.red(`getUrlBodyFromAo3 failed: ${err.message}`));
    return false;
  }
};
