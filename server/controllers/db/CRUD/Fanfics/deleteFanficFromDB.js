const clc = require("cli-color");
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

exports.deleteFanficFromDB = async (req,res) =>{
    console.log(clc.blue('[db controller] deleteFanficFromDB()'));
    let {fandomName,fanficId,source,complete} = req.query;
    console.log('fandomName,fanficId,source:',fandomName,fanficId,source)

    await mongoose.dbFanfics.collection(fandomName).deleteOne({FanficID:Number(fanficId)});
    const FanficsInFandom = `${source}.FanficsInFandom`,DeletedFanfics = `${source}.DeletedFanfics`;

    const isComplete = (complete==='true') ? `${source}.CompleteFanfics` :  `${source}.OnGoingFanfics`;
    let isCompleteCounter = await mongoose.dbFanfics.collection(fandomName).countDocuments({'Source':source,'Complete':complete});
    isCompleteCounter  = (isCompleteCounter-1)<=0 ? 0 : isCompleteCounter-1;

    let DeletedFanficsCounter = await mongoose.dbFanfics.collection(fandomName).countDocuments({'Source':source,'Deleted':true});
    DeletedFanficsCounter  = (DeletedFanficsCounter-1)<=0 ? 0 : DeletedFanficsCounter-1;
    console.log('DeletedFanficsCounter:',DeletedFanficsCounter)
    await FandomModal.updateOne({'FandomName': fandomName },
                                { $inc: { 'FanficsInFandom':-1,
                                          [FanficsInFandom]:-1
                                        },
                                  $set:{
                                      [DeletedFanfics]:DeletedFanficsCounter,
                                      [isComplete]:isCompleteCounter
                                  }
                                });

    res.send(true)
}
