const mongoose = require('../../../../config/mongoose');

exports.getListOfDuplicateTitles = async (log, fandom) => {
    console.log('getListOfDuplicateTitles')

    const { FandomName, Collection } = fandom;

    const collectionName = (Collection && Collection !== '') ? Collection : FandomName;
    
    console.log('collectionName:',collectionName)
    console.log('FandomName:',FandomName)
    
    return new Promise(async function (resolve, reject) {
        await mongoose.dbFanfics.collection(collectionName).aggregate([
            {
                $group: {
                    _id: { FanficTitle: "$FanficTitle"},
                    uniqueIds: { $addToSet: "$FanficID" },
                    Author: { $addToSet: "$Author" },
                    FandomName: { $addToSet: '$FandomName'},
                    SimilarCheck: {$addToSet: '$SimilarCheck'},
                    count: { $sum: 1 }
                }
            },
            { $match: { count: { "$eq": 2 } , FandomName: {$eq: FandomName, $size: 1}, SimilarCheck: {$ne: 'unique'} }
        }], async function(err, cursor) {
            let resultsList = [];
            if (err) {
                console.log(err);
                reject(err);
              } else {
                cursor.on("data", function(doc) {
                    resultsList.push(doc)
                });
          
                cursor.once("end", function() {
                    log.info(resultsList);
                    resolve(resultsList)  
                });
              }
        })   
    });      
};