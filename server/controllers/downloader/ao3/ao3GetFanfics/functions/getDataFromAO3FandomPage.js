const clc = require("cli-color");
const cheerio = require('cheerio');

const { sleep } = require('../../../../helpers/sleep.js')
const { getDataFromFanficPage } = require('./getDataFromFanficPage/getDataFromFanficPage');

exports.getDataFromAO3FandomPage = async (jar, pageNumber, numberOfPages, log, page, fandom, savedNotAuto) => {
    // console.log(clc.blue('[ao3 controller] getDataFromAO3FandomPage()'));
    try {
        let $ = cheerio.load(page), donePromise = 0;
        let n = $('ol.work').children('li').length;
        log.info(`----- fanfics in page:`, $);
        console.log('num fanfics in page: ', n)
        let counter;

        for (let count = 0; count < n; count++) {
            console.log('sleeping...');
            await sleep(4000);
            console.log(clc.cyan(`Done sleeping... Getting info of fanfic [ ${count+1} / ${n} ] from page [ ${pageNumber+1} / ${numberOfPages} ]`));
            let page = $('ol.work').children('li').eq(count);

            await getDataFromFanficPage(jar, log, page, fandom, savedNotAuto).then(res => {
                donePromise++;
                res === 0 && counter++;
            });
            if (donePromise == n) { return counter }
        }
    } catch (e) { console.log(e); }
}

