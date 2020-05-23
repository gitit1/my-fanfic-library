const clc = require("cli-color");
const cheerio = require('cheerio');

const { sleep } = require('../../../../helpers/sleep');
const ffHelpers = require('../../helpers/index');
const { checkFanfic } = require('../functions/checkFanfic')

exports.getDataFromFFFandomPage = async (log, fandomName, pageNumber, url, collection) => {
    console.log(clc.blue('[ff controller] getDataFromFFFandomPage() - pageNumber:',pageNumber));
    try {
        let page = await ffHelpers.getUrlBodyFromSite(url)

        let $ = cheerio.load(page), donePromise = 0;
        let n = $('.zpointer').length;
        console.log('number of fanfics in page: ', n)
        let counter;

        for (let count = 0; count < n; count++) {
            console.log('sleeping...');
            await sleep(4000);
            console.log('done sleeping... getting info of fanfic',count);
            let data = $('.zpointer').eq(count).html();

            await checkFanfic(log, data, fandomName, collection).then(res => {
                donePromise++;
                res === 0 && counter++;
            })
            if (donePromise == n) { return counter }
        }
    } catch (e) { console.log(e); }
}
