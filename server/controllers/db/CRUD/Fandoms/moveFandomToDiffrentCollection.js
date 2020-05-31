const mongoose = require('../../../../config/mongoose');

exports.moveFandomToDiffrentCollection = async (fandomName, oldCollection, newCollection) => {
    console.log('[moveFandomToDiffrentCollection]', fandomName)

    return new Promise(async function(resolve, reject) { 
        mongoose.dbFanfics.collection(oldCollection).find({}).toArray(async function (err, dbFanfic) {
            console.log('dbFanfic.length:',dbFanfic.length)
            dbFanfic.forEach(async function(doc) {
                await mongoose.dbFanfics.collection(newCollection).insertOne(doc);
                await  mongoose.dbFanfics.collection(oldCollection).deleteOne(doc);
            });
            resolve('done!')
        }); 
    })
} 