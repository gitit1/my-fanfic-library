const clc = require("cli-color");
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

exports.deleteFanficFromDB = async (req, res) => {
  console.log(clc.blue('[db controller] deleteFanficFromDB()'));
  let { fandomName, fanficId, source, complete, deleted } = req.query;
  await deleteFanficFromDBFunc(fandomName, fanficId, source, complete, deleted);
  res.send(true)
}

exports.deleteFanficFromDBInt = async (fandomName, fanficId, source, complete, deleted, collection) => {
  await deleteFanficFromDBFunc(fandomName, fanficId, source, complete, deleted, collection);
  return true;
}

const deleteFanficFromDBFunc = (fandomName, fanficId, source, complete, deleted, collection) => {
  return new Promise(async (resolve, reject) => {
    if(!collection){
      const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
      collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandomName;
    } else {
        collectionName = collection;
    }

    await mongoose.dbFanfics.collection(collectionName).deleteOne({ FanficID: Number(fanficId) });
    const TotalFanficsInFandom = `${source}.TotalFanficsInFandom`,
      FanficsInSite = `${source}.FanficsInSite`
    DeletedFanfics = `${source}.DeletedFanfics`;

    const isComplete = (complete === 'true') ? `${source}.CompleteFanfics` : `${source}.OnGoingFanfics`;
    let isCompleteCounter = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'Complete': complete });
    isCompleteCounter = (isCompleteCounter - 1) <= 0 ? 0 : isCompleteCounter - 1;

    let DeletedFanficsCounter = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'Deleted': true });
    if (deleted === 'true') {
      DeletedFanficsCounter = (DeletedFanficsCounter - 1) <= 0 ? 0 : DeletedFanficsCounter - 1;
    }

    console.log('DeletedFanficsCounter:', DeletedFanficsCounter)
    await FandomModal.updateOne({ 'FandomName': fandomName },
      {
        $inc: {
          'FanficsInFandom': -1,
          [TotalFanficsInFandom]: -1,
          [FanficsInSite]: -1
        },
        $set: {
          [DeletedFanfics]: DeletedFanficsCounter,
          [isComplete]: isCompleteCounter
        }
      });
    resolve(true)
  });

}
