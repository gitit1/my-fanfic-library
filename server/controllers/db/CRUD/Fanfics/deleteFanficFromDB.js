const clc = require("cli-color");
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

exports.deleteFanficFromDB = async (req,res) =>{
    console.log(clc.blue('[db controller] deleteFanficFromDB()'));
    let {fandomName,fanficId,source,complete,deleted} = req.query;
    console.log('fandomName,fanficId,source,deleted:',fandomName,fanficId,source,deleted)

    const fandomData = await FandomModal.find({ 'FandomName': fandom }, function (err, fandoms) { if (err) { throw err; } });
    const collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandom;

    await mongoose.dbFanfics.collection(collectionName).deleteOne({FanficID:Number(fanficId)});
    const TotalFanficsInFandom = `${source}.TotalFanficsInFandom`,
          FanficsInSite = `${source}.FanficsInSite`
          DeletedFanfics = `${source}.DeletedFanfics`;

    const isComplete = (complete==='true') ? `${source}.CompleteFanfics` :  `${source}.OnGoingFanfics`;
    let isCompleteCounter = await mongoose.dbFanfics.collection(collectionName).countDocuments({'Source':source,'Complete':complete});
    isCompleteCounter  = (isCompleteCounter-1)<=0 ? 0 : isCompleteCounter-1;

    let DeletedFanficsCounter = await mongoose.dbFanfics.collection(collectionName).countDocuments({'Source':source,'Deleted':true});
    if(deleted==='true'){
      DeletedFanficsCounter  = (DeletedFanficsCounter-1)<=0 ? 0 : DeletedFanficsCounter-1;
    }

    console.log('DeletedFanficsCounter:',DeletedFanficsCounter)
    await FandomModal.updateOne({'FandomName': fandomName },
                                { $inc: { 'FanficsInFandom':-1,
                                          [TotalFanficsInFandom]:-1,
                                          [FanficsInSite]:-1
                                        },
                                  $set:{
                                      [DeletedFanfics]:DeletedFanficsCounter,
                                      [isComplete]:isCompleteCounter
                                  }
                                });

    res.send(true)
}
