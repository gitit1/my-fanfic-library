const clc = require("cli-color");
const cheerio = require('cheerio');

const { sleep } = require('../../../../helpers/sleep');
const ffHelpers = require('../../helpers/index');
const { checkFanfic } = require('../functions/checkFanfic')

exports.getDataFromFFFandomPage = async (log, fandomName, pageNumber, url) => {
    console.log(clc.blue('[ff controller] getDataFromFFFandomPage()'));
    try {
        let page = await ffHelpers.getUrlBodyFromSite(url)

        //let page = '' //TODO: TEMP

        let $ = cheerio.load(page), donePromise = 0;
        let n = $('.zpointer').length;
        //console.log('num fanfics in page: ', n)
        let counter;

        // console.log('pagesArray: ',pageNumber,' - sleeping...');
        // await sleep(5000);
        // console.log('pagesArray: ',pageNumber,' - done sleeping...');

        
        // n = 1; //TODO: TEMP

        for (let count = 0; count < n; count++) {
            console.log('sleeping...');
            await sleep(8000);
            console.log('done sleeping...');
            let data = $('.zpointer').eq(count).html();

            await checkFanfic(log, data, fandomName).then(res => {
                donePromise++;
                res === 0 && counter++;
            })
            if (donePromise == n) { return counter }
        }
    } catch (e) { console.log(e); }
}
