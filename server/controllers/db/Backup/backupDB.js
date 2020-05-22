
const clc = require("cli-color");
const fs = require('fs');
const pLimit = require('p-limit');

const mongoose = require('../../../config/mongoose');
const FanficSchema = require('../../../models/Fanfic');

const { sleep } = require('../../helpers/sleep');
const { fetchFandoms } = require("../../helpers/fetchFandoms.js");

const path = `public/logs/DB_Backup`;

exports.backupDBHandler = async (req, res) => {
    console.log(clc.blue('[db controller] backupDBHandler()'));
    await this.backupDB().then(() => {
        console.log('created backup to all fandoms')
        res.send('created backup to all fandoms')
    })
}

exports.backupDB = async () => {
    console.log(clc.blue('[db controller] backupDB()'));
    let allFandoms = await fetchFandoms();

    let promises = [], limit = pLimit(1);
    for (let i = 0; i < allFandoms.length; i++) {

        promises.push(limit(async () => {
            console.log('working on:', allFandoms[i].FandomName);
            const collectionName = (allFandoms[i].Collection && allFandoms[i].Collection !== '') ? allFandoms[i].Collection : allFandoms[i].FandomName;
            const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema, collectionName);
            return await FanficDB.find({ 'FandomName': allFandoms[i].FandomName }, async function (err, fanfics) {
                await sleep(8000);
                fs.writeFile(`${path}/${allFandoms[i].FandomName}.json`, JSON.stringify(fanfics, null, 4), (err) => {
                    if (err) { console.error(err); return; };
                    console.log(`${allFandoms[i].FandomName} - File has been created`);
                    resolve();
                });
            })
        }));
    }
    await Promise.all(promises).then(async results => {
        return
    });
}