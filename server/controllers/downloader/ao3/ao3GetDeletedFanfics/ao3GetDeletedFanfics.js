const clc = require("cli-color");
const cheerio = require('cheerio');
const mongoose = require('../../../../config/mongoose');
let request = require('request')
const pLimit = require('p-limit');


const FanficSchema = require('../../../../models/Fanfic');
const ao3Funcs = require('../ao3GetFanfics/functions/index');
const { updateFandomFanficsNumbers } = require('../../helpers/index');
const { ao3Request: AO3 } = require('../../../../helpers/index');

// TODO: ADD THE OOPSITE: CHECK IF IS MARKED AS DELETED BUT EXSISTS

exports.ao3GetDeletedFanfics = async (jar, log, fandom) => {
    return new Promise(async function (resolve, reject) {
        const { Collection, FandomName, SearchKeys } = fandom;
        const collectionName = (Collection && Collection !== '') ? Collection : FandomName;
        const msg = clc.xterm(127).bgXterm(39);
        const msgH = clc.xterm(125).bgXterm(247);
        const client = AO3.createAo3Request(jar);

        await ao3Funcs.loginToAO3(jar);
        const searchKeysArr = SearchKeys.split(',');
        let pagesArray = [];
        for (let i = 0; i < searchKeysArr.length; i++) {
            console.log(msg('Search Keys:', searchKeysArr[i]));
            const ao3URL = await ao3Funcs.createAO3Url(searchKeysArr[i]);
            let numberOfPages = await ao3Funcs.getNumberOfSearchPages(jar, ao3URL, log);
            console.log(msg('numberOfPages:', numberOfPages));
            const tempPagesArr = await ao3Funcs.getPagesOfFandomData(jar, ao3URL, numberOfPages, 0);
            pagesArray = pagesArray.concat(tempPagesArr)
        }

        console.log('pagesArray.length:', pagesArray.length)

        const limit = pLimit(1);

        let promises = [], fanficsInAO3 = [];

        for (let pageNumber = 0; pageNumber < pagesArray.length; pageNumber++) {
            promises.push(limit(async () => {
                const fanficsInPage = await getFanficsIds(pagesArray[pageNumber]);
                fanficsInAO3 = fanficsInAO3.concat(fanficsInPage);
                fanficsInAO3 = [...new Set(fanficsInAO3)];
            }));
        }

        await Promise.all(promises).then(async () => {
            let allDeletedFanfics = 0, allDeletedFanficsFull = 0;
            let fanficsInDB = await getListOfFanficsIdsFromDBWhoAreNotDeleted(FandomName, collectionName);
            console.log(msgH('-------Deleting Fanfics:-----------')); log.info('-------Deleting Fanfics:-----------');
            console.log(msg('Number of Fanfics in AO3:', fanficsInAO3.length)); log.info(`Number of Fanfics in AO3: ${fanficsInAO3.length}`);
            console.log(msg('Number of AO3 (Not Deleted) Fanfics in DB:', fanficsInDB.length)); log.info(`Number of Fanfics in DB: ${fanficsInDB.length}`);

            let deletedFanfics = await compareBetweenAO3andDB(fanficsInAO3, fanficsInDB);

            if (deletedFanfics.length > 0) {
                allDeletedFanfics = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'FandomName': FandomName, 'Deleted': true });
                console.log(msg('Number of New Deleted Fanfics:', deletedFanfics.length)); log.info(`Number of New Deleted Fanfics: ${deletedFanfics.length}`);
                console.log(msg('Number of All Deleted Fanfics Before Saving New Ones:', allDeletedFanfics));
                await saveDeletedFanficsInDB(deletedFanfics, collectionName, true);
                allDeletedFanficsFull = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'FandomName': FandomName, 'Deleted': true });
                console.log(msg('Number of All Deleted Fanfics After Saving New Ones:', allDeletedFanficsFull)); log.info(`Number of All Deleted Fanfics After Saving New Ones: ${allDeletedFanficsFull}`);
                /*console.log(msg('Array of New Deleted Fanfics:', deletedFanfics));*/ log.info(`Array of New Deleted Fanfics: ${deletedFanfics}`);
                await updateFandomFanficsNumbers(fandom, 'AO3');
            } else {
                console.log(msgH('There are no new deleted fanfics'));
            }
            console.log(msgH('-----------------------------'));

            console.log(msgH('-------Restoring Fanfics:-----------')); log.info('-------Restoring Fanfics:-----------');
            fanficsInDB = await getListOfFanficsIdsFromDBWhoAreDeleted(FandomName, collectionName);
            console.log(msg('Number of Fanfics in AO3:', fanficsInAO3.length));
            console.log(msg('Number of AO3 (Deleted Fanfics) in DB:', fanficsInDB.length));

            let restoredFanfics = await compareBetweenAO3andDBOfDeleted(fanficsInAO3, fanficsInDB);
            if (restoredFanfics.length > 0) {
                allDeletedFanfics = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'FandomName': FandomName, 'Deleted': true });
                console.log(msg('Number of Restored Fanfics:', restoredFanfics.length));
                console.log(msg('Number of All Deleted Fanfics Before Saving Restored Ones:', allDeletedFanfics));
                await saveDeletedFanficsInDB(restoredFanfics, collectionName, false);
                /*console.log(msg('Array of Restored Fanfics:', restoredFanfics)); */log.info(`Array of Restored Fanfics: ${restoredFanfics}`);
                allDeletedFanficsFull = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'FandomName': FandomName, 'Deleted': true });
                console.log(msg('Number of All Deleted Fanfics After Saving New Ones:', allDeletedFanficsFull)); log.info(`Number of All Deleted Fanfics After Saving New Ones: ${allDeletedFanficsFull}`);
                await updateFandomFanficsNumbers(fandom, 'AO3');
            } else {
                console.log(msgH('There are no restored fanfics'));
            }
            console.log(msgH('-----------------------------'));
            resolve([deletedFanfics.length, restoredFanfics.length, allDeletedFanficsFull]);
        });
    })
}

const getFanficsIds = (page) => {
    return new Promise(async function (resolve, reject) {
        let $ = cheerio.load(page), fanficsIds = [];
        $('ol.work').children('li').each(index => {
            let id = Number($('ol.work').children('li').eq(index).attr('id').replace('work_', ''));
            fanficsIds.push(id)
        });
        resolve(fanficsIds)
    })
}

const getListOfFanficsIdsFromDBWhoAreNotDeleted = (fandomName, collectionName) => {
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema, collectionName);

    return new Promise(function (resolve, reject) {
        FanficDB.find({ Source: 'AO3', FandomName: fandomName, Deleted: false }).exec(async function (err, fanfics) {
            let fanficsInDB = [];

            for (let i = 0; i < fanfics.length; i++) {
                fanficsInDB.push(fanfics[i].FanficID);
            }
            resolve(fanficsInDB)
        });
    });
}

const compareBetweenAO3andDB = (fanficsInAO3, fanficsInDB) => {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < fanficsInAO3.length; i++) {
            position = fanficsInDB.indexOf(fanficsInAO3[i]);
            if (~position) fanficsInDB.splice(position, 1);
        }
        resolve(fanficsInDB)
    })
}

const saveDeletedFanficsInDB = (deletedFanfics, collectionName, type) => {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < deletedFanfics.length; i++) {
            await mongoose.dbFanfics.collection(collectionName).updateOne({ 'FanficID': deletedFanfics[i] }, { $set: { Deleted: type, 'SavedFic': true } });
        }
        resolve();
    })
}

// ------------------------------------------

const getListOfFanficsIdsFromDBWhoAreDeleted = (fandomName, collectionName) => {
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema, collectionName);

    return new Promise(function (resolve, reject) {
        FanficDB.find({ Source: 'AO3', FandomName: fandomName, Deleted: true }).exec(async function (err, fanfics) {
            let fanficsInDB = [];

            for (let i = 0; i < fanfics.length; i++) {
                fanficsInDB.push(fanfics[i].FanficID);
            }
            resolve(fanficsInDB)
        });
    });
}

const compareBetweenAO3andDBOfDeleted = (fanficsInAO3, fanficsInDB) => {
    return new Promise(function (resolve, reject) {
        let restoredFanfics = [];
        for (let i = 0; i < fanficsInAO3.length; i++) {
            position = fanficsInDB.indexOf(fanficsInAO3[i]);
            if (~position) restoredFanfics.push(fanficsInAO3[i]);
        }
        resolve(restoredFanfics)
    })
}