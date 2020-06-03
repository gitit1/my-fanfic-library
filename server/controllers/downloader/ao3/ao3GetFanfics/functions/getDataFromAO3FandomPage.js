const clc = require("cli-color");
const cheerio = require('cheerio');

const { sleep } = require('../../../../helpers/sleep.js')
const { getDataFromFanficPage } = require('./getDataFromFanficPage/getDataFromFanficPage');

exports.getDataFromAO3FandomPage = async (jar, pageNumber, numberOfPages, log, page, fandom, mainSearchKeys) => {
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
            let page = $('ol.work').children('li').eq(count), hasMainSearchKeys;

            if(mainSearchKeys!==''){
                hasMainSearchKeys = false;
                page.find('.tags').children('.relationships').each(index => {
                    if(!hasMainSearchKeys){
                        hasMainSearchKeys = page.find('.tags').children('.relationships').eq(index).find('a').text() === mainSearchKeys;
                    };
                })
            } else {
                hasMainSearchKeys = false //HE IS THE MAIN SO I DONT CARE IF HE HAS THEM OR NOT - NEET TO RUN ON IT ANYWAY
            }

            !hasMainSearchKeys && await getDataFromFanficPage(jar, log, page, fandom).then(res => {
                donePromise++;
                res === 0 && counter++;
            });
            if (donePromise == n) { return counter }
        }
    } catch (e) { console.log(e); }
}

