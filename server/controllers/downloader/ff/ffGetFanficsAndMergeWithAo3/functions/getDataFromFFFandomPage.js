const clc = require("cli-color");
const cheerio = require('cheerio');

const { sleep } = require('../../../../helpers/sleep');
const ffHelpers = require('../../helpers/index');
const { checkFanfic } = require('../functions/checkFanfic')

exports.getDataFromFFFandomPage = async (log, fandomName, pageNumber, numberOfPages, url, collection) => {
    console.log(clc.blue('[ff controller] getDataFromFFFandomPage() - pageNumber:',pageNumber));
    try {
        let page = await ffHelpers.getUrlBodyFromSite(url)

        let $ = cheerio.load(page), donePromise = 0;
        let n = $('.zpointer').length;
        let counter;
		
        for (let count = 0; count < n; count++) {
            console.log('Sleeping...');
            await sleep(4000);
		    console.log(clc.magenta(`Done sleeping... Getting info of fanfic [ ${count+1} / ${n} ] from page [ ${pageNumber} / ${numberOfPages} ]`));
            let data = $('.zpointer').eq(count).html();

            await checkFanfic(log, data, fandomName, collection).then(res => {
                donePromise++;
                res === 0 && counter++;
            })
            if (donePromise == n) { return counter }
        }
    } catch (e) { console.log(e); }
}
