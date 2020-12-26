const clc = require("cli-color");
const cheerio = require('cheerio');
const pLimit = require('p-limit');

const ffHelpers = require('../helpers/index');
const { getDataFromFFFandomPage } = require('./functions/getDataFromFFFandomPage')
const { updateFandomFanficsNumbers } = require('../../helpers/index')

exports.ffGetFanficsAndMergeWithAo3 = async (log, fandom, type, ffSearchUrl) => {
    console.log(clc.blue(`[ff controller] ffGetFanficsAndMergeWithAo3() - ${type} run`));
    const { FandomName, Collection } = fandom;

    if (!ffSearchUrl) {
        return;
    }

    let numberOfPages = 0, fanficsInFandom, savedFanficsCurrent = 0;

    let body = await ffHelpers.getUrlBodyFromSite(ffSearchUrl);

    let $ = cheerio.load(body);

    tempNum = $('#content_wrapper center a:contains("Last")').attr('href');
    numberOfPages = tempNum ? Number(tempNum.split('&p=')[1]) : $('#content_wrapper center a:contains("Next »")') ? 2 : 1;

    numberOfPages = (type === 'partial') ? 1 : numberOfPages;

    console.log('numberOfPages:', numberOfPages);

    const limit = pLimit(1);

    let promises = [];

    for (let i = 1; i < numberOfPages + 1; i++) {
        promises.push(limit(async () => {
            await getDataFromFFFandomPage(log, FandomName, i, numberOfPages, `${ffSearchUrl}&p=${i}`, Collection)
        }));
    }

    await Promise.all(promises).then(async results => {
        let counterArray = results.filter(function (num) { return (!isNaN(num)); });
        savedFanficsCurrent = savedFanficsCurrent + counterArray.reduce((a, b) => a + b, 0);
    });

    fanficsInFandom = await updateFandomFanficsNumbers(fandom, 'FF');

    return [fanficsInFandom, savedFanficsCurrent];

}