const clc = require("cli-color");
const cheerio = require('cheerio');
let request = require('request')
const pLimit = require('p-limit');

const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');
const ao3Funcs = require('./functions')
const { updateFandomFanficsNumbers } = require('../../helpers/index')

exports.ao3GetFanfics = async (jar, log, fandom, type) => {
    // TODO: IF WE SAVE FILE - ADD THE MISSING DATA TO DB
    console.log(clc.blue(`[ao3 controller] ao3GetFanfics() - ${type} run`));
    const { SearchKeys } = fandom;
 
    request = request.defaults({ jar: jar, followAllRedirects: true });

    await ao3Funcs.loginToAO3(jar);

    const savedNotAuto = null;

    const ao3URL = await ao3Funcs.createAO3Url(SearchKeys);

    let numberOfPages = 0, fanficsInFandom, savedFanficsCurrent = 0;

    let body = await ao3Funcs.getUrlBodyFromAo3(jar, ao3URL, log);

    let $ = cheerio.load(body);

    if (Number($('#main').find('ol.pagination li').eq(-2).text()) === 0) {
        numberOfPages = 1
    } else if (Number($('#main').find('ol.pagination li').eq(-2).text()) >= 10) {
        numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text()) + 1;
    } else {
        numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text());
    }

    numberOfPages = (type === 'partial') ?  2 : numberOfPages;
    console.log('numberOfPages:',numberOfPages)

    let pagesArray = await ao3Funcs.getPagesOfFandomData(jar, ao3URL, numberOfPages, log);

    const limit = (type === 'partial') ? pLimit(1) : pLimit(6);

    let promises = [];

    for (let i = 0; i < pagesArray.length; i++) {
        promises.push(limit(async () => {
            await ao3Funcs.getDataFromAO3FandomPage(jar, i, log, pagesArray[i], fandom, savedNotAuto)
        }));
    }

    await Promise.all(promises).then(async results => {
        let counterArray = results.filter(function (num) { return (!isNaN(num)); });
        savedFanficsCurrent = savedFanficsCurrent + counterArray.reduce((a, b) => a + b, 0);
    });

    await updateFandomFanficsNumbers(fandom, 'AO3');
    
    return [fanficsInFandom,savedFanficsCurrent]; 
}
