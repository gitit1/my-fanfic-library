const moment = require('moment');
const mongoose = require('../../../../../../../config/mongoose');

exports.checkIfFanficIsNewOrUpdated = async (fandomName,fanfic) =>{
    let oldFanficData = false,fandom = null;
    let isThisWeek =  moment(new Date(fanfic.LastUpdateOfFic)).isSame(new Date(), 'week')
    
    if(isThisWeek){
        
        fandom = await mongoose.dbFanfics.collection(fandomName).findOne({FanficID: fanfic["FanficID"]})
        fandom!==null && (oldFanficData = fandom)
        console.log(`-----${fanfic["FanficTitle"]}------`)

        // let isThisWeekOldData =  moment(new Date(oldFanficData.LastUpdateOfFic)).isSame(new Date(), 'week')
        // console.log(new Date(oldFanficData.LastUpdateOfFic))
        // console.log('isThisWeekOldData',isThisWeekOldData)

        console.log('Completed',fanfic["Complete"] !== oldFanficData.Complete)
        console.log('fanfic["LastUpdateOfFic"]',fanfic["LastUpdateOfFic"])
        console.log('oldFanficData.LastUpdateOfFic',oldFanficData.LastUpdateOfFic)
        console.log('fanfic["LastUpdateOfFic"] > oldFanficData.LastUpdateOfFic',fanfic["LastUpdateOfFic"] > oldFanficData.LastUpdateOfNote)


        newFic = (fandom===null) ? true : false
        updated =   (!newFic && ((fanfic["FanficTitle"] !== oldFanficData.FanficTitle) || 
        (fanfic["LastUpdateOfFic"] > oldFanficData.LastUpdateOfFic) ||
        (fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters) ||
        (fanfic["Author"] !== oldFanficData.Author) ))  ? true : false;
        
        console.log('updated',updated)
        console.log('newFic',newFic)
        // updated = (!isThisWeekOldData && !newFic) ? updated : false;

        newFic      &&    console.log(`New Fanfic: ${fanfic["FanficTitle"]} - Saving into the DB`);
        updated     &&    console.log(`Updated Fanfic - ${fanfic["FanficTitle"]} - Saving into the DB`);
        
        fanfic["Status"] = newFic ? 'new' : updated ? 'updated' : 'old';
        
        console.log('Completed',fanfic["Complete"] !== oldFanficData.Complete)
        console.log('NumberOfChapters',fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters)
        console.log('FanficTitle',fanfic["FanficTitle"] !== oldFanficData.FanficTitle)
        
        if(!updated && !newFic){
            fanfic["StatusDetails"] = 'old';
        }else if(updated){
            fanfic["StatusDetails"] =   (fanfic["Complete"] !== oldFanficData.Complete) ? 'Completed' :
                                        (fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters) ? 'Chapter' :
                                        (fanfic["Author"] !== oldFanficData.Author) ? 'Author' :
                                        (fanfic["FanficTitle"] !== oldFanficData.FanficTitle) ? 'Title' : 'old';
        }else{
            fanfic["StatusDetails"] =   fanfic["Oneshot"] ? 'Oneshot' : 'old';
        }
       
        console.log('Status',fanfic["Status"]);
        console.log('Status Details',fanfic["StatusDetails"]);
        console.log(`------------------`)
        return ([newFic,updated,fanfic])
    }else{
        return([false,false,fanfic])
    }
}
