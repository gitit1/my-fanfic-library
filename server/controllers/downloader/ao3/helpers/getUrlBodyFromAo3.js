// getUrlBodyFromAo3 via ao3Request.getPage
const clc = require('cli-color');
const { ao3Request: AO3 } = require('../../../../helpers/index');

exports.getUrlBodyFromAo3 = async (jar, url, log) => {
  try {
    return await AO3.getPage(jar, url, { log });
  } catch (e) {
    console.log(clc.red(`getUrlBodyFromAo3 failed: ${e.message}`));
    return false;
  }
};
