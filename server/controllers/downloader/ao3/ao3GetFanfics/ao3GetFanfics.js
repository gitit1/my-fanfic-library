const clc = require("cli-color");
const cheerio = require('cheerio');
let request = require('request')
const pLimit = require('p-limit');

const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');
const ao3Funcs = require('./functions')

exports.ao3GetFanfics = async (jar, log, fandom, type) => {
    // TODO: IF WE SAVE FILE - ADD THE MISSING DATA TO DB
    console.log(clc.blue(`[ao3 controller] ao3GetFanfics() - ${type} run`));
    const { FandomName, SearchKeys, Collection } = fandom;
 
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

    numberOfPages = (type==='partial') ? (numberOfPages > 10) ? 2 : numberOfPages : numberOfPages;
    console.log('numberOfPages:',numberOfPages)

    let pagesArray = await ao3Funcs.getPagesOfFandomData(jar, ao3URL, numberOfPages, log);

    const limit = (type === 'partial') ? pLimit(1) : pLimit(4);

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

    const collectionName = (Collection && Collection !== '') ? Collection : FandomName;
    fanficsInFandom = await mongoose.dbFanfics.collection(collectionName).countDocuments({'FandomName': FandomName});

    const AO3FanficsInFandom = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': 'AO3', 'FandomName': FandomName });
    const AO3CompleteFanfics = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': 'AO3', 'Complete': true, 'FandomName': FandomName });
    const AO3SavedFanfics = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': 'AO3', 'SavedFic': true, 'FandomName': FandomName });
    AO3SavedFanfics === 0 ? savedFanficsCurrent : AO3SavedFanfics;
    const AO3OnGoingFanfics = AO3FanficsInFandom - AO3CompleteFanfics;

    await FandomModal.updateOne({ 'FandomName': FandomName },
        {
            $set: {
                'FanficsInFandom': fanficsInFandom,
                'AO3.FanficsInFandom': AO3FanficsInFandom,
                'AO3.CompleteFanfics': AO3CompleteFanfics,
                'AO3.OnGoingFanfics': AO3OnGoingFanfics,
                'AO3.SavedFanfics': AO3SavedFanfics,
                'LastUpdate': new Date().getTime(),
                'FanficsLastUpdate': new Date().getTime(),
                'SavedFanficsLastUpdate': new Date().getTime()
            }
        },
        (err, result) => {
            if (err) throw err;

        }
    );

    return; 
        
}
