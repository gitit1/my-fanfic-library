const mongoose = require('../../../../config/mongoose');
const UpdatesModal = require('../../../../models/Updates');

const funcs = require('./generalFunctions');

exports.saveFanficToDB = (fandomName, fanfic, collection) => {
    // console.log(clc.bgGreenBright('[ao3 controller] saveFanfficToDB()',fandomName));   
    return new Promise(async function (resolve, reject) {
        let status = (fanfic.Status === 'new' || fanfic.Status === 'updated') ? true : false;

        const collectionName = (collection && collection !== '') ? collection : fandomName;
        //console.log('collectionName:',collectionName)

        mongoose.dbFanfics.collection(collectionName).findOne({ FanficID: fanfic["FanficID"] }, async function (err, dbFanfic) {
            if (err) {
                funcs.delay(1000).then(async () => reject(false))
                return reject()
            }
            let isExist = (dbFanfic === null) ? false : true;
            if (!isExist) {
                mongoose.dbFanfics.collection(collectionName).insertOne(fanfic, async function (error, response) {
                    await funcs.delay(1000).then(async () => {
                        status && await saveUpdatesToDB(fandomName, fanfic)
                        resolve(true)
                    })
                });

            } else {
                mongoose.dbFanfics.collection(collectionName).updateOne({ 'FanficID': fanfic["FanficID"] }, { $set: fanfic }, async function (error, response) {
                    await funcs.delay(1000).then(async () => {
                        status && await saveUpdatesToDB(fandomName, fanfic)
                        resolve(true)
                    })
                })
            }
        });
        console.log('Saved to DB!');
    });
}

const saveUpdatesToDB = (fandomName, fanfic) => {
    console.log('***************************************saveUpdatesToDB');
    console.log('fanfic.LastUpdateOfFic:', fanfic.LastUpdateOfFic);
    let fanficDate = new Date(fanfic.LastUpdateOfFic)
    fanficDate = fanficDate.getFullYear() + "/" + (fanficDate.getMonth() + 1) + "/" + fanficDate.getDate();
    fanficDate = new Date(new Date(fanficDate).setHours(0, 0, 0, 0)).getTime();
    console.log('fanficDate:', fanficDate);


    return new Promise(async function (resolve, reject) {
        (fanfic.StatusDetails !== 'old') ? (
            UpdatesModal.findOne({ Date: fanficDate }, async function (err, dbUpdate) {
                if (err) {
                    console.log('---error', fanfic.FanficID)
                    funcs.delay(1000).then(async () => reject(false))
                    return reject()
                }
                let isExist = (dbUpdate === null) ? false : true;
                let FanficsIds = [{
                    'FanficID': fanfic.FanficID,
                    'FanficTitle': fanfic.FanficTitle,
                    'Author': fanfic.Author,
                    'Source': fanfic.Source,
                    'Status': fanfic.Status,
                    'StatusDetails': fanfic.StatusDetails
                }]
                if (!isExist) {
                    // console.log('---date not exist')
                    let type = fanfic.Status === 'new' ? 'New' : 'Updated';

                    let update = {
                        'Date': fanficDate,
                        'Fandom': [
                            {
                                'FandomName': fandomName,
                                [type]: 1,
                                'FanficsIds': FanficsIds
                            }
                        ]
                    }

                    const fandomData = new UpdatesModal(update);
                    await fandomData.save();
                    resolve();
                } else {
                    // console.log('---date exist')
                    UpdatesModal.findOne({ 'Date': fanficDate, 'Fandom.FandomName': fandomName }, async function (err, dbUpdate) {
                        if (err) {
                            // console.log('---date exist error')
                            funcs.delay(1000).then(async () => reject(false))
                            return reject()
                        }
                        let isExist = (dbUpdate === null) ? false : true;
                        if (!isExist) {
                            console.log('---date exist  - fandom dont exist')
                            let type = fanfic.Status === 'new' ? 'New' : 'Updated';

                            await UpdatesModal.updateOne({ 'Date': fanficDate },
                                {
                                    $push: {
                                        'Fandom': {
                                            'FandomName': fandomName, [type]: 1,
                                            'FanficsIds': FanficsIds
                                        }
                                    }
                                });
                            resolve()
                        } else {
                            console.log('---date exist  - fandom  exist')
                            let type = fanfic.Status === 'new' ? 'Fandom.$.New' : 'Fandom.$.Updated';
                            await UpdatesModal.updateOne({ 'Date': fanficDate, 'Fandom.FandomName': fandomName },
                                {
                                    $inc: { [type]: 1 },
                                    $push: { 'Fandom.$.FanficsIds': FanficsIds }
                                });
                            resolve()
                        }

                    })
                }
            })
        ) : resolve()
    });


}