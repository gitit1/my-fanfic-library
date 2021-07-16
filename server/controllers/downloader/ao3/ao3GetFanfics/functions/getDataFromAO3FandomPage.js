const clc = require("cli-color");
const cheerio = require('cheerio');

const { sleep } = require('../../../../helpers/sleep.js')
const { getDataFromFanficPage } = require('./getDataFromFanficPage/getDataFromFanficPage');

exports.getDataFromAO3FandomPage = async (jar, pageNumber, numberOfPages, log, page, fandom, searchKeys, mainSearchKeys, fromPage, toPage) => {
    // console.log(clc.blue('[ao3 controller] getDataFromAO3FandomPage()'));
    try {
        let $ = cheerio.load(page), donePromise = 0;
        let n = $('ol.work').children('li').length;
        log.info(`----- fanfics in page:`, $);
        console.log('num fanfics in page: ', n)
        let counter;
        const startPage = fromPage ? fromPage : pageNumber + 1;
        const endPage = toPage ? toPage : numberOfPages;

        for (let count = 0; count < n; count++) {
            console.log('sleeping...');
            pageNumber === 1 ? await sleep(2000) : await sleep(1500);
            console.log(clc.cyan(`Done sleeping... Getting info of fanfic [ ${count + 1} / ${n} ] from page [ ${startPage} / ${endPage} ]`));
            let page = $('ol.work').children('li').eq(count), hasMainSearchKeys;

            if (mainSearchKeys !== '') {
                hasMainSearchKeys = false;
                let relTag = page.find('.tags').children('.relationships');
                relTag.each(index => {
                    hasMainSearchKeys = fandom.IgnoreSearchKeys && fandom.IgnoreSearchKeys.includes(relTag.eq(0).find('a').text()) ? true : false;
                    if (!hasMainSearchKeys && index <= 1) {
                        hasMainSearchKeys = relTag.eq(index).find('a').text() === mainSearchKeys;
                    };
                    if (hasMainSearchKeys) return false;
                });
            } else {
                hasMainSearchKeys = false //HE IS THE MAIN SO I DONT CARE IF HE HAS THEM OR NOT - NEET TO RUN ON IT ANYWAY
            }
            if (!hasMainSearchKeys) {
                await getDataFromFanficPage(jar, log, page, fandom, searchKeys).then(res => {
                    donePromise++;
                    res === 0 && counter++;
                });
            } else {
                if (donePromise == n) { return counter }
            }
        }
    } catch (e) { console.log(e); }
}

