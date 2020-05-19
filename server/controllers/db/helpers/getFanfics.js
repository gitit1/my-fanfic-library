const clc = require("cli-color");
const mongoose = require('../../../config/mongoose');
const FandomModal = require('../../../models/Fandom');
const FanficSchema = require('../../../models/Fanfic');

exports.getFanfics = (skip, limit, fandomName, filters, sortObj, list, readingList, userSorted) => {
    return new Promise(async function (resolve, reject) {
        skip = (Number(skip) < 0) ? 0 : Number(skip)
        limit = (Number(limit) < 0) ? 0 : Number(limit)
        let promises = [];
        let fullFilters = { 'FandomName': fandomName, ...filters }

        console.log(clc.bgGreenBright('[db controller] getFanfics()'));

        sort = userSorted ? {} : (sortObj === null) ? { ['LastUpdateOfFic']: -1, ['LastUpdateOfNote']: 1 } : sortObj
        console.log('sort 3:', sort)

        if (list === 'true') {
            readingList.FanficsFandoms.map(async fandom => {
                const fandomData = await FandomModal.find({ 'FandomName': fandom }, function (err, fandoms) { if (err) { throw err; } });
                const collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandom;

                const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema, collectionName);
                promises.push(getFanficsofFandoms(FanficDB, fullFilters, 0, 0));
            });

            await Promise.all(promises).then(async fanfics => {
                let arrfanfics = await fanfics.reduce(function (arr, e) { return arr.concat(e) })
                arrfanfics = await arrfanfics.slice(skip, limit + skip)
                resolve(arrfanfics)
            });

        } else {
            const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
            const collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandomName;

            const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema, collectionName);
            fanfics = await getFanficsofFandoms(FanficDB, fullFilters, skip, limit)
            resolve(fanfics)
        }
    });
}

const getFanficsofFandoms = (FanficDB, filters, skip, limit) => {
    return new Promise(function (resolve, reject) {
        FanficDB.find(filters).sort(sort).skip(skip).limit(limit).exec(async function (err, fanfics) {
            err && reject(err)
            resolve(fanfics)
        })
    });
}