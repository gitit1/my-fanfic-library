
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');
const funcs = require('../../helpers/index')
const { deleteFanficFromDBInt } = require('../../../db/CRUD/Fanfics/deleteFanficFromDB');

exports.saveAsSimilarFanfic = async (similar, fandomName, id1, id2) => {
    return await new Promise(async function (resolve, reject) {
        console.log(`[Manually] - saveAsSimilarFanfic - ${similar ? 'Merge' : 'UnMerge'}`);

        const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
        collection = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandomName;
        let fanfic1 = await funcs.getFanficByID(fandomName, id1);
        let fanfic2 = await funcs.getFanficByID(fandomName, id2);
        fanfic1 = fanfic1[0], fanfic2 = fanfic2[0];
        console.log(`fanfic1 ID: ${fanfic1.FanficID}, Source: ${fanfic1.Source}`);
        console.log(`fanfic2 ID: ${fanfic2.FanficID}, Source: ${fanfic2.Source}`);
        let todayDate = new Date();
        if (similar) {
            fanfic1.SimilarCheck = fanfic2.FanficID;
            fanfic1.HasFFLink = true;
            fanfic1.FanficID_FF = fanfic2.FanficID;
            fanfic1.AuthorURL_FF = fanfic2.AuthorURL;
            fanfic1.URL_FF = fanfic2.URL;
            fanfic1.SimilarCheck = fanfic2.FanficID;
            fanfic1.Comments  = (fanfic1.Comments < fanfic2.Comments) ? fanfic2.Comments : fanfic1.Comments;
            fanfic1.Kudos  = (fanfic1.Kudos < fanfic2.Kudos) ? fanfic2.Kudos : fanfic1.Kudos;
            fanfic1.Bookmarks  = (fanfic1.Bookmarks < fanfic2.Bookmarks) ? fanfic2.Bookmarks : fanfic1.Bookmarks;
            fanfic1.LastUpdateOfNote = todayDate.getTime();
            if (fanfic2.image) { fanfic1.image = fanfic2.image }
            if ((fanfic2.NumberOfChapters > fanfic1.NumberOfChapters) && !fanfic1.Complete) {
                fanfic1.NumberOfChapters = fanfic2.NumberOfChapters;
                fanfic1.Complete = fanfic2.Complete;
                fanfic1.Words = fanfic2.Words;
                fanfic1.PublishDate = fanfic2.PublishDate;
                fanfic1.LastUpdateOfFic = fanfic2.LastUpdateOfFic;
                fanfic1.LastUpdateOfNote = fanfic2.LastUpdateOfNote;
            }

            await funcs.saveFanficToDB(fandomName, fanfic1, collection);
            await deleteFanficFromDBInt(fandomName, fanfic2.FanficID, fanfic2.Source, fanfic2.Complete, fanfic2.Delete, collection);
            resolve(true)
        } else {
            fanfic1.SimilarCheck= 'unique';
            fanfic1.LastUpdateOfNote = todayDate.getTime();

            fanfic2.SimilarCheck= 'unique';
            fanfic2.LastUpdateOfNote = todayDate.getTime();

            await funcs.saveFanficToDB(fandomName, fanfic1, collection);
            await funcs.saveFanficToDB(fandomName, fanfic2, collection);
            resolve(true)
        }
        resolve(true)
    });
}