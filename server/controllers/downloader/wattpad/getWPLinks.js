const clc = require("cli-color");
const pLimit = require('p-limit');
const mongoose = require('../../../config/mongoose');
const FandomModal = require('../../../models/Fandom');
const { getPaths } = require("./paths.js");
const { getDataFromEpub } = require("./getDataFromEpub.js");
const logger = require('simple-node-logger');

exports.wpDownloader = async (fandomName) => {
    let fandomNameLC = fandomName.toLowerCase();
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
            await getDataFromEpub(log, fandomName, fanficsPathsArray[i])
        }));
    }

    await Promise.all(promises);

    fanficsInFandom = await mongoose.dbFanfics.collection(fandomName).countDocuments({});

    const WPFanficsInFandom = await mongoose.dbFanfics.collection(fandomName).countDocuments({ 'Source': 'Wattpad' });
    const WPCompleteFanfics = await mongoose.dbFanfics.collection(fandomName).countDocuments({ 'Source': 'Wattpad', 'Complete': true });
    const WPSavedFanfics = await mongoose.dbFanfics.collection(fandomName).countDocuments({ 'Source': 'Wattpad', 'SavedFic': true });
    const WPOnGoingFanfics = WPFanficsInFandom - WPCompleteFanfics;

    await FandomModal.updateOne({ 'FandomName': fandomName },
        {
            $set: {
                'FanficsInFandom': fanficsInFandom,
                'Wattpad.FanficsInFandom': WPFanficsInFandom,
                'Wattpad.CompleteFanfics': WPCompleteFanfics,
                'Wattpad.OnGoingFanfics': WPOnGoingFanfics,
                'Wattpad.SavedFanfics': WPSavedFanfics,
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


