/*
TODO:  function/router: ffGetDeletedFanfics
TODO:  function/router: ffSaveMissingFanfics

TODO:  function/router: wattpadGetFanfics
TODO:  function/router: wattpadGetDeletedFanfics
TODO:  function/router: wattpadAddNewFanfic
TODO:  function/router: wattpadDownloadFanfic
TODO:  function/router: wattpadSaveMissingFanfics
*/
const clc = require("cli-color");
const mongoose = require('../../config/mongoose');
const multer = require('multer');
const ao3 = require('./ao3/ao3');
const ff = require('./ff/ff');
const wp = require('./wattpad/getWPLinks')
const manually = require('./manually/manually');
const fileReader = require('./fileReader/fileReader');
const funcs = require('./helpers/index')

const logger = require('simple-node-logger');
let request = require('request')
let jar = request.jar();


exports.getFanfics = async (fandom, log, type, ao3Flag, ffFlag) => {
    msg('start', `getFanfics - ${type}`);
    const opts = {
        logDirectory: `public/logs/downloader`,
        fileNamePattern: `${fandom.FandomName}-<DATE>-ff-automatic-downloader.log`,
        dateFormat: 'YYYY.MM.DD'
    };

    if (!ao3Flag && !ffFlag) { return [0, 0] }

    let getFanficsAO3 = [0, 0]
    let getFanficsFF = [0, 0]

    if (ao3Flag) {
        const searchKeysAO3Arr = fandom.SearchKeys.split(',');
        console.log('AO3 - searchKeysArr:', searchKeysAO3Arr)

        for (let i = searchKeysAO3Arr.length - 1; i >= 0; i--) {
            if (i == 0) {
                getFanficsTemp = await ao3.ao3GetFanfics(jar, log, fandom, type, searchKeysAO3Arr[i].trim(), '');
            } else {
                getFanficsTemp = await ao3.ao3GetFanfics(jar, log, fandom, type, searchKeysAO3Arr[i].trim(), searchKeysAO3Arr[0].trim());
            }
            getFanficsAO3[0] = getFanficsAO3[0] + getFanficsTemp[0];
            getFanficsAO3[1] = getFanficsAO3[1] + getFanficsTemp[1];
        }
    }

    if(ffFlag){
        const searchKeysFFArr = fandom.FFSearchUrl.split(',');
        const log2 = logger.createRollingFileLogger(opts);
        console.log('FF - searchKeysArr:', searchKeysFFArr)
        for (let i = 0; i < searchKeysFFArr.length; i++) {
            getFanficsTemp = ffFlag && await ff.ffGetFanficsAndMergeWithAo3(log2, fandom, type, searchKeysFFArr[i].trim());
            getFanficsFF[0] = getFanficsFF[0] + getFanficsTemp[0];
            getFanficsFF[1] = getFanficsFF[1] + getFanficsTemp[1];
        }
    }


    const allFanfics = getFanficsAO3 && getFanficsFF ? getFanficsFF[0] : getFanficsAO3 ? getFanficsAO3[0] : getFanficsFF[0];
    const savedFanfics = getFanficsAO3 && getFanficsFF ? getFanficsFF[1] + getFanficsAO3[1] : getFanficsAO3 ? getFanficsAO3[1] : getFanficsFF[1];

    console.log('allFanfics:', allFanfics);
    console.log('savedFanfics:', savedFanfics);
    msg('end');
    return [allFanfics, savedFanfics];
}
exports.getDeletedFanfics = async (log, fandom) => {
    msg('start', `getDeletedFanfics - ${fandom.FandomName}`);
    let results = await ao3.ao3GetDeletedFanfics(jar, log, fandom);
    msg('end');
    return [results[0], results[1], results[2]];
}
exports.saveMissingFanfics = async (fandom) => {
    //TODO: NOT WORKING PROPERLY - NEED TO FIX IT TO MATCH BOTH FF AND AO3
    msg('start', `saveMissingFanfics - ${fandom.FandomName}`);
    let saveMissingFanfics = await ao3.ao3SaveMissingFanfics(jar, fandom);
    msg('end');
    return saveMissingFanfics;
}
exports.getFanficDataFromFile = async (req, res) => {
    const { fandomName, filetype, fileName, isDeleted } = req.query;
    msg('start', `getFanficDataFromFile, ${filetype.toLowerCase()}`);
    const deleted = isDeleted === 'true' ? true : false;

    switch (filetype.toLowerCase()) {
        case 'epub':
            await fileReader.getEpub(fandomName, filetype, fileName, deleted, req, res).then(fanfic => {
                msg('end');
                res.send(fanfic);
            });
            break;
        case 'pdf':
            await fileReader.getPdf(fandomName, filetype, fileName, deleted, req, res).then(fanfic => {
                msg('end');
                res.send(fanfic);
            });
            break;
        default:
            msg('end');
            res.send(false);
            break;
    }
}
exports.saveFanficFromFile = async (req, res) => {
    const { fandomName, fileName } = req.query;
    msg('start', `saveFanficFromFile - ${fandomName}`);
    await fileReader.saveNewFanfic(fandomName, fileName, req, res).then(() => {
        msg('end');
        res.send();
    });
}
exports.getNewFanfic = async (req, res) => {
    const { type, url, fanficID, fandomName } = req.query;
    msg('start', `getNewFanfic - ${fandomName}`);
    let data = null;
    if (type === 'manually') {
        let upload = multer({}).single();
        await upload(req, res, async function (err) {
            data = await manually.addNewFanfic(fandomName, req.body);
            msg('end');
            res.send(data);
        })
    } else if (type === 'automatic') {
        data = url.includes('archiveofourown.org') ? await ao3.ao3AddNewFanfic(jar, url, fandomName) :
            url.includes('fanfiction.net') ? await ff.ffAddNewFanfic(url, fandomName)
                : null;
        msg('end');
        res.send(data);
    } else {
        data = await funcs.getFanficByID(fandomName, fanficID);
        msg('end');
        res.send(data);
    }
}

exports.saveNewFanfic = async (req, res) => {
    const { fandomName, download, url } = req.query;
    const fanfic = req.body;
    msg('start', `saveNewFanfic - ${fandomName}`);
    if (url === 'null') {
        await manually.saveNewFanfic(fandomName, req, res).then(() => {
            msg('end');
            res.send();
        });
    } else { //Automatic
        fanfic.Deleted = false;
        url.includes('archiveofourown.org') && await ao3.ao3SaveFanfic(jar, fandomName, download, url, fanfic).then(() => {
            msg('end');
            res.send();
        })
        url.includes('fanfiction.net') && await ff.ffSaveFanfic(fandomName, download, url, fanfic).then(() => {
            msg('end');
            res.send();
        })
    }
}

exports.updateExistFanfic = async (req, res) => {
    msg('start', `updateExistFanfic`);
    await manually.updateExistFanfic(req.query.fandomName, req, res);
    msg('end');
    res.send();
}

exports.saveAsSimilarFanfic = async (req, res) => {
    const { isSimilar, fandomName, fanfic1ID, fanfic2ID } = req.query;
    msg('start', `saveAsSimilarFanfic - ${fandomName}`);
    const similar = (isSimilar === 'true') ? true : false;
    await manually.saveAsSimilarFanfic(similar, fandomName, fanfic1ID, fanfic2ID).then(() => {
        msg('end');
        res.send(true);
    });
}

//wattpad
exports.wpd = async (req, res) => {
    console.log('wpd');
    await wp.wpDownloader('avalance');
    res.send('wpd done');
}

//testing
exports.testingArea = async (req, res) => {
    console.log('testingArea')
    let fandomName = 'Trishica';

    mongoose.dbFanfics.collection(fandomName).find({ Source: 'Backup' }).toArray(async function (err, dbFanfic) {
        console.log('dbFanfic.length:', dbFanfic.length)
        for (let index = 0; index < dbFanfic.length; index++) {
            mongoose.dbFanfics.collection(fandomName).updateOne({ FanficID: dbFanfic[index].FanficID },
                { $set: { Source: 'AO3', Deleted: true } }, async function (error, response) { })
        }
    });
}

const msg = (type, msg) => {
    switch (type) {
        case 'start':
            // console.log(clc.xterm(88).bgXterm(253)('------------------------ Start ------------------------'));
            console.log(clc.xterm(56).bgXterm(253)(`[Downloader Handler] ${msg}`));
            break;
        case 'end':
            // console.log(clc.xterm(88).bgXterm(253)('------------------------ End ------------------------'));
            break;
        default:
            break;
    }
}