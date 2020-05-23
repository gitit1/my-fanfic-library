const moment = require('moment');
const mongoose = require('../../../../../../../config/mongoose');

exports.checkIfFanficIsNewOrUpdated = async (log, fandomName, fanfic, collection) => {
    let oldFanficData;
    //let isThisWeek =  moment(new Date(fanfic.LastUpdateOfFic)).isSame(new Date(), 'month')
    // let isThisWeek =  moment(new Date(fanfic.LastUpdateOfFic)).isSame(new Date(), 'week')

    // if(isThisWeek){

    const collectionName = (collection && collection !== '') ? collection : fandomName;
    oldFanficData = await mongoose.dbFanfics.collection(collectionName).findOne({ FanficID: fanfic["FanficID"] })


    if (oldFanficData !== null) {
        console.log('HHHHHHHHHH - old status:')
        console.log('Completed', fanfic["Complete"] !== oldFanficData.Complete)
        console.log('fanfic["LastUpdateOfFic"]', fanfic["LastUpdateOfFic"])
        console.log('oldFanficData.LastUpdateOfFic', oldFanficData.LastUpdateOfFic)
        console.log('fanfic["LastUpdateOfFic"] > oldFanficData.LastUpdateOfFic', fanfic["LastUpdateOfFic"] > oldFanficData.LastUpdateOfNote)
    }

    newFic = (oldFanficData === null) ? true : false;


    updated = (!newFic && oldFanficData !== null && (
        (fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters) ||
        (fanfic["FanficTitle"] !== oldFanficData.FanficTitle) ||
        (fanfic["LastUpdateOfFic"] > oldFanficData.LastUpdateOfFic) ||
        (fanfic["Author"] !== oldFanficData.Author)
    )) ? true : false;

    newFic && console.log(`New Fanfic: ${fanfic["FanficTitle"]} - Saving into the DB`);
    newFic && log.info(`New Fanfic: ${fanfic["FanficID"]} - ${fanfic["FanficTitle"]}`);
    updated && console.log(`Updated Fanfic - ${fanfic["FanficTitle"]} - Saving into the DB`);
    updated && log.info(`Updated Fanfic: ${fanfic["FanficID"]} - ${fanfic["FanficTitle"]}`);

    console.log('updated', updated)
    console.log('newFic', newFic)

    fanfic["Status"] = newFic ? 'new' : updated ? 'updated' : 'old';

    if (oldFanficData !== null) {
        console.log('HHHHHHHHHH - did status changed?:')
        console.log('Completed', fanfic["Complete"] !== oldFanficData.Complete)
        console.log('NumberOfChapters', fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters)
        console.log('FanficTitle', fanfic["FanficTitle"] !== oldFanficData.FanficTitle)
    }

    if (!updated && !newFic) {
        fanfic["StatusDetails"] = 'old';
    } else if (updated) {
        fanfic["StatusDetails"] = (fanfic["Complete"]) ? 'completed' :
            (fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters) ? 'chapter' :
                (fanfic["Author"] !== oldFanficData.Author) ? 'author' :
                    (fanfic["FanficTitle"] !== oldFanficData.FanficTitle) ? 'title' : 'old';
    } else {
        fanfic["StatusDetails"] = fanfic["Oneshot"] ? 'Oneshot' : 'new';
    }

    console.log('Status', fanfic["Status"]);
    console.log('Status Details', fanfic["StatusDetails"]);


    if (oldFanficData !== null && !oldFanficData['SavedFic']) {
        if (oldFanficData.fileName !== undefined && oldFanficData.fileName !== '') {
            fanfic.SavedFic = true;
            fanfic.NeedToSaveFlag = false;
        } else {
            return ([true, false, fanfic])
        }
    }
    return ([newFic, updated, fanfic])
}
