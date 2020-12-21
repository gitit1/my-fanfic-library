const clc = require ('cli-color');
const puppeteer = require('puppeteer');

exports.getUrlBodyFromSite = url => {
  console.log(clc.blue(`[ff controller] getUrlBodyFromSite()`));
  return new Promise (async function (resolve, reject) {
    const browser = await puppeteer.launch(
        {
        ignoreHTTPSErrors: true,
        args :[
          '--ignore-certificate-errors',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--lang=ja,en-US;q=0.9,en;q=0.8',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        ]
    });
    const page = await browser.newPage();
    const response = await page.goto(url);
    await page.close();
    await browser.close();
    resolve (await response.text());
  });
};