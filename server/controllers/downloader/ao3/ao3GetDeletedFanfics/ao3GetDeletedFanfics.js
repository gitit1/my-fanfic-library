const clc = require("cli-color");
const cheerio = require('cheerio');
const mongoose = require('../../../../config/mongoose');
let request = require('request')
const pLimit = require('p-limit');

const FandomModal = require('../../../../models/Fandom');
const FanficSchema = require('../../../../models/Fanfic');
const { loginToAO3 } = require('../helpers/loginToAO3');

const func = require('../../helpers/index');

exports.ao3GetDeletedFanfics = async (jar, log, fandomName, collection) => {
    console.log(clc.bgGreenBright('[ao3 controller] checkIfDeletedFromAO3()'));

    request = request.defaults({ jar: jar, followAllRedirects: true });
    await loginToAO3(jar)

    const collectionName = (collection && collection !== '') ? collection : fandomName;
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema, collectionName);
    
    let promises = [], gotDeletedArray = [];

    const getFanficList = () => {
        return new Promise(function (resolve, reject) {
            FanficDB.find({ Source: 'AO3', 'FandomName': fandomName }).sort({ ['LastUpdateOfFic']: -1, ['LastUpdateOfNote']: 1 }).exec(async function (err, fanfics) {
                const limit = pLimit(3);

                for (let i = 0; i < fanfics.length; i++) {
                    promises.push(limit(async () => {
                        await new Promise(resolve => setTimeout(resolve, 4000));
                        await checkIfDeleted(jar, fanfics[i], i)
                    }));
                }
                resolve()
            });
        });
    }

    const checkIfDeleted = (jar, fanfic, index) => {
        let url = fanfic.URL;
        return new Promise(function (resolve, reject) {
            request.get({ url, jar: jar, credentials: 'include' }, async function (err, httpResponse, body) {
                try {
                    func.delay(4000).then(async () => {
                        console.log('fanfic number: ', index, ' , id: ', fanfic.FanficID);
                        log.info(`-----Fanfic number: ${index} , id: ${fanfic.FanficID}`);

                        if (httpResponse === undefined || httpResponse.body === undefined) {
                            reject(console.log(clc.red('Error in checkIfDeleted: body undefined: ', fanfic.FanficID, ' url: ', fanfic.URL)))
                        } else {
                            let $ = cheerio.load(httpResponse.body);
                            if (err) {
                                reject(console.log(clc.red('Error in checkIfDeleted: ', err)))
                            } else {
                                if ($('#main h2').text().includes("Error 404") || $('#main div.error').text().includes("you don't have permission")) {
                                    console.log(clc.redBright(`Deleted fanfic:: ${fanfic.FanficTitle}`));
                                    log.info(`-----Deleted fanfic: ${fanfic.FanficID}`);
                                    if (!fanfic.Deleted) {
                                        gotDeletedArray.push(fanfic);
                                        log.info(`-----Added deleted fanfic flag to fanfic: ${fanfic.FanficID}`);
                                        fanfic.LastUpdateOfNote = new Date().getTime();
                                        await mongoose.dbFanfics.collection(fandomName).updateOne({ 'FanficID': fanfic.FanficID }, { $set: { Deleted: true } })
                                        await mongoose.dbFanfics.collection('deletedFanfics').deleteOne(fanfic)
                                    }
                                } else if (httpResponse.body.includes("Retry later")) {
                                    console.log('site is down, move on');
                                    log.info(`-----Retry later: ${fanfic.FanficID}`);
                                    await func.delay(40000);
                                } else if (fanfic.Deleted) {
                                    console.log(clc.redBright(`Restored fanfic:: ${fanfic.FanficTitle}`));
                                    log.info(`-----Found fanfic who restored: ${fanfic.FanficID}`);
                                    fanfic.LastUpdateOfNote = new Date().getTime();
                                    await mongoose.dbFanfics.collection(fandomName).updateOne({ 'FanficID': fanfic.FanficID }, { $set: { Deleted: false } })
                                    await mongoose.dbFanfics.collection('deletedFanfics').deleteOne(fanfic)
                                }
                                resolve();
                            }
                        }
                    })
                } catch (error) {
                    console.log('error in checkIfDeleted:', error)// handle error
                }
            });
        });
    }


    await getFanficList();

    return await Promise.all(promises).then(async () => {
        let DeletedCounter = [];
        console.log('fandomName:', fandomName)
        console.log('gotDeletedArray.length:', gotDeletedArray.length)
        const deletedFanfics = await mongoose.dbFanfics.collection(fandomName).countDocuments({ 'Source': 'AO3', 'Deleted': true });
        log.info(`-----deletedFanfics: ${deletedFanfics}`);
        await FandomModal.updateOne({ 'FandomName': fandomName }, { $set: { 'AO3.DeletedFanfics': deletedFanfics } }, (err, result) => { (err) ? console.log('error:', err) : console.log('update deleted!') });

        DeletedCounter.push(gotDeletedArray.length);
        DeletedCounter.push(deletedFanfics);

        return DeletedCounter
    }).catch(error => console.log(clc.red('Error in checkIfDeletedFromAO3()', error)));
}

//TODO: add status deleted too fanfic for my update follow up

//problem : 20372752