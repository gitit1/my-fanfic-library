
const clc = require("cli-color");
const fs = require('fs');
const pLimit = require('p-limit');

const mongoose = require('../../config/mongoose');
const FanficSchema = require('../../models/Fanfic');
const {fetchFandoms} = require("../helpers/fetchFandoms");
const { getFanfics } = require('../db/helpers/getFanfics')
const path = `public/logs/DB_Backup`;

exports.backupDB = async (req,res) =>{
    let allFandoms = await fetchFandoms()

    // let allFandoms = [{FandomName:'test fandom'},{FandomName:'Avalance'}]

    // console.log('allFandoms:', allFandoms);
    
    let promises = [], limit = pLimit(1);;
    for (let i = 0; i < allFandoms.length; i++) {
         
        promises.push(limit(async () =>{
            const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,allFandoms[i].FandomName);
            return await FanficDB.find({}, function(err, fanfics) {
                return [fanfics]
            })
        } ));
    }
    await Promise.all(promises).then(async results=> {
        results.map(db => {
            console.log('db:', db[0].FandomName)
            //console.log('path:', path)
            fs.writeFile(`${path}/${db[0].FandomName}.json`, JSON.stringify(db, null, 4), (err) => {
                if (err) {console.error(err); return;};
                console.log(`${db[0].FandomName} - File has been created`);
            });
        })
    });
        
}