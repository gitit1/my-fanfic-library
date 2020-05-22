const clc = require("cli-color");
const cheerio = require('cheerio');
let request = require('request')
const pLimit = require('p-limit');

const mongoose = require('../../../../config/mongoose');
const ffHelpers = require('../helpers/index');
const { getDataFromFFFandomPage } = require('./functions/getDataFromFFFandomPage')

//FFSearchUrl



exports.ffGetFanficsAndMergeWithAo3 = async (log, fandom, type) => {
    console.log(clc.blue(`[ff controller] ffGetFanficsAndMergeWithAo3() - ${type} run`));
    const { FandomName, FFSearchUrl } = fandom;

    //temp - lost girl / atypical / ouat
    //FFSearchUrl = "http://www.fanfiction.net/tv/Lost-Girl/?&srt=1&r=10&c1=55093&c2=55096" 
    //FFSearchUrl = "https://www.fanfiction.net/tv/Atypical/?&srt=1&r=10&c1=167272&c2=167279"
    //FFSearchUrl = "https://www.fanfiction.net/tv/Once-Upon-a-Time/?&srt=1&r=10&c1=74164&c2=74168"

    let numberOfPages = 0, fanficsInFandom, savedFanficsCurrent = 0;

    let body = await ffHelpers.getUrlBodyFromSite(FFSearchUrl);

    let $ = cheerio.load(body);

    tempNum = $('#content_wrapper center a:contains("Last")').attr('href');
    numberOfPages = tempNum ? Number(tempNum.split('&p=')[1]) : 1;

    numberOfPages = (type === 'partial') ? (numberOfPages > 10) ? 2 : numberOfPages : numberOfPages;

    console.log('numberOfPages:', numberOfPages);

    const limit = pLimit(1);

    let promises = [];

    for (let i = 1; i < numberOfPages + 1; i++) {
        promises.push(limit(async () => {
            await getDataFromFFFandomPage(log, FandomName, i, `${FFSearchUrl}&p=${i}`)
        }));
    }

    return await Promise.all(promises).then(async results => {
        // let counterArray = results.filter(function (num) { return (!isNaN(num)); });
        // savedFanficsCurrent = savedFanficsCurrent + counterArray.reduce((a, b) => a + b, 0);
        // console.log('counterArray:', counterArray)
        return;
    });

      

}