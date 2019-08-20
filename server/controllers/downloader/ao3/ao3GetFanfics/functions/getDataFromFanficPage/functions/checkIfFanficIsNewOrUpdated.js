const moment = require('moment');
const mongoose = require('../../../../../../../config/mongoose');

exports.checkIfFanficIsNewOrUpdated = async fanfic =>{
    let oldFanficData = false,fandom = null;
    let isThisWeek =  moment(new Date(fanficUpdateDate)).isSame(new Date(), 'week')
    
    if(isThisWeek){
        
        fandom = await mongoose.dbFanfics.collection(fandomName).findOne({FanficID: fanfic["FanficID"]})
        fandom!==null && (oldFanficData = fandom)
        
        let isThisWeekOldData =  moment(new Date(oldFanficData.LastUpdateOfFic)).isSame(new Date(), 'week')
        
        updated =   (fanfic["FanficTitle"] !== oldFanficData.FanficTitle) || 
                    (fanfic["LastUpdateOfNote"] > oldFanficData.LastUpdateOfNote) ||
                    (fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters) ? true : false;
        
        newFic = (fandom===null) ? true : false
        updated = isThisWeekOldData ? false : updated

        newFic      &&    console.log(`New Fanfic: ${fanfic["FanficTitle"]} - Saving into the DB`);
        updated     &&    console.log(`Updated Fanfic - ${fanfic["FanficTitle"]} - Saving into the DB`);

        fanfic["NeedToSaveFlag"] = (updated||newFic) && true;
        fanfic["Status"] = newFic ? 'new' : 'updated';

        fanfic["StatusDetails"] =   updated && (
                                        (fanfic["Complete"] !== oldFanficData.Complete) ? 'Completed' :
                                        (fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters) ? 'Chapter' :
                                        (fanfic["FanficTitle"] !== oldFanficData.FanficTitle) ? 'Title' : null
                                    );
        return ([newFic,updated,fanfic])
    }else{
        return([false,false,fanfic])
    }
}
