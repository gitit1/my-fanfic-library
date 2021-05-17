const clc = require("cli-color");
const pLimit = require('p-limit');
const mongoose = require('../../../config/mongoose');
const FandomModal = require('../../../models/Fandom');
const { getPaths } = require("./paths.js");
const { getDataFromEpub } = require("./getDataFromEpub.js");
const logger = require('simple-node-logger');
const { updateFandomFanficsNumbers } = require('../helpers/index');

exports.wpDownloader = async (fandomName) => {
    let fandomNameLC = fandomName.toLowerCase();
    const fandom = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
    const collectionName = (fandom[0].Collection && fandom[0].Collection !== '') ? fandom[0].Collection : fandomName;
    const opts = {
        logDirectory: `public/logs/wp`,
        fileNamePattern: `<DATE>-${fandomNameLC}-similar-fanfics.log`,
        dateFormat: 'YYYY.MM.DD'
    };
    const log = logger.createRollingFileLogger(opts);
    const limit = pLimit(1);
    //const path = `public/Calibre Portable/Fandoms/Original Work/Albaluz/Saved by a Woman (GirlxGirl) {Compl (4325)`;
    const path = `public/Calibre Portable/Fandoms/${fandomNameLC}`;
    let fanficsPathsArray = await getPaths(path);

    let promises = [];

    for (let i = 0; i < fanficsPathsArray.length; i++) {
        promises.push(limit(async () => {
            await getDataFromEpub(log, fandomName, fanficsPathsArray[i], collectionName)
        }));
    }

    await Promise.all(promises);

    await updateFandomFanficsNumbers(fandom[0], 'Wattpad');

    return;
}


