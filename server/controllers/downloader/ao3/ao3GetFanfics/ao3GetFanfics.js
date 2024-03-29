const clc = require("cli-color");
let request = require('request')
const pLimit = require('p-limit');

const ao3Funcs = require('./functions');
const { updateFandomFanficsNumbers } = require('../../helpers/index')

exports.ao3GetFanfics = async (jar, log, fandom, type, searchKeys, mainSearchKeys, fromPage, toPage) => {
    console.log(clc.xterm(175)(`[ao3 controller] ao3GetFanfics() --- Run Type:: ${type} --- Search Keys: ${searchKeys}`));
    return new Promise(async function (resolve, reject) {
        const { FanficsLastUpdate, Priority } = fandom;

        let promises = [], fanficsInFandom, savedFanficsCurrent = 0; 
        let pagePatialLimit = (Priority === 1) ? 2 : 1;
        let promiseLimit = (Priority === 1) ? 6 : (Priority === 2) ? 8 : 10;
        // const limit = (type === 'partial' || FanficsLastUpdate === undefined) ? pLimit(1) : pLimit(promiseLimit);
        const limit = pLimit(1);

        request = request.defaults({ jar: jar, followAllRedirects: true });

        await ao3Funcs.loginToAO3(jar);

        const ao3URL = await ao3Funcs.createAO3Url(searchKeys);

        let numberOfPages = await ao3Funcs.getNumberOfSearchPages(jar, ao3URL, log);

        numberOfPages = toPage ? (toPage - fromPage + 1) : (type === 'partial') ? pagePatialLimit : numberOfPages;
        console.log('Number of Pages:', numberOfPages)
        
        let pagesArray = await ao3Funcs.getPagesOfFandomData(jar, ao3URL, numberOfPages, fromPage);
        const startPage = fromPage ? fromPage : 0;
        const endPage = toPage ? toPage + 1 : pagesArray.length;

        for (let pageNumber = startPage; pageNumber < endPage; pageNumber++) {
            promises.push(limit(async () => {
                await ao3Funcs.getDataFromAO3FandomPage(jar, pageNumber, numberOfPages, log, pagesArray[pageNumber], fandom, searchKeys, mainSearchKeys, fromPage, toPage)
            }));
        }

        await Promise.all(promises).then(async results => {
            let counterArray = results.filter(function (num) { return (!isNaN(num)); });
            savedFanficsCurrent = savedFanficsCurrent + counterArray.reduce((a, b) => a + b, 0);
        });

        fanficsInFandom = await updateFandomFanficsNumbers(fandom, 'AO3');

        resolve([fanficsInFandom, savedFanficsCurrent]);
    })
}
