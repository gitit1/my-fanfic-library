const clc = require("cli-color");
const cheerio = require('cheerio');
const pLimit = require('p-limit');

const ffHelpers = require('../helpers/index');
const { getDataFromFFFandomPage } = require('./functions/getDataFromFFFandomPage')
const { updateFandomFanficsNumbers } = require('../../helpers/index')

exports.ffGetFanficsAndMergeWithAo3 = async (log, fandom, type, ffSearchUrl, fromPage, toPage) => {
    console.log(clc.xterm(175)(`[ff controller] ffGetFanficsAndMergeWithAo3() - ${type} run`));
    const { FandomName, Collection } = fandom;

    if (!ffSearchUrl) {
        return;
    }

    let numberOfPages = 0, fanficsInFandom, savedFanficsCurrent = 0;

    let body = await ffHelpers.getUrlBodyFromSite(ffSearchUrl);

    let $ = cheerio.load(body);

    tempNum = $('#content_wrapper center a:contains("Last")').attr('href');
    numberOfPages = tempNum ? Number(tempNum.split('&p=')[1]) : $('#content_wrapper center a:contains("Next »")') ? 2 : 1;

    numberOfPages = toPage ? (toPage - fromPage + 1) : (type === 'partial') ? 1 : numberOfPages;

    console.log('numberOfPages:', numberOfPages);

    const limit = pLimit(1);

    let promises = [];

    const startPage = fromPage ? fromPage : 1;
    const endPage = toPage ? toPage : numberOfPages;

    for (let i = startPage; i < endPage + 1; i++) {
        promises.push(limit(async () => {
            await getDataFromFFFandomPage(log, FandomName, i, numberOfPages, `${ffSearchUrl}&p=${i}`, Collection, fromPage, toPage)
        }));
    }

    await Promise.all(promises).then(async results => {
        let counterArray = results.filter(function (num) { return (!isNaN(num)); });
        savedFanficsCurrent = savedFanficsCurrent + counterArray.reduce((a, b) => a + b, 0);
    });

    fanficsInFandom = await updateFandomFanficsNumbers(fandom, 'FF');

    return [fanficsInFandom, savedFanficsCurrent];

}