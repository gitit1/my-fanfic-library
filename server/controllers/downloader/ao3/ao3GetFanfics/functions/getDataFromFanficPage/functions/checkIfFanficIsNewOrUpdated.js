const moment = require('moment');
const mongoose = require('../../../../../../../config/mongoose');

exports.checkIfFanficIsNewOrUpdated = async (log, fandomName,fanfic) =>{
    let oldFanficData = false,fandom = null;
    //let isThisWeek =  moment(new Date(fanfic.LastUpdateOfFic)).isSame(new Date(), 'month')
    // let isThisWeek =  moment(new Date(fanfic.LastUpdateOfFic)).isSame(new Date(), 'week')
    
    // if(isThisWeek){
        
        fandom = await mongoose.dbFanfics.collection(fandomName).findOne({FanficID: fanfic["FanficID"]})
        fandom!==null && (oldFanficData = fandom)
        console.log(`-----${fanfic["FanficTitle"]}------`)

        console.log('Completed',fanfic["Complete"] !== oldFanficData.Complete)
        console.log('fanfic["LastUpdateOfFic"]',fanfic["LastUpdateOfFic"])
        console.log('oldFanficData.LastUpdateOfFic',oldFanficData.LastUpdateOfFic)
        console.log('fanfic["LastUpdateOfFic"] > oldFanficData.LastUpdateOfFic',fanfic["LastUpdateOfFic"] > oldFanficData.LastUpdateOfNote)

        newFic = (fandom===null) ? true : false;


        
        updated =   (!newFic && (
                    (fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters) ||
                    (fanfic["FanficTitle"] !== oldFanficData.FanficTitle) || 
                    (fanfic["LastUpdateOfFic"] > oldFanficData.LastUpdateOfFic) ||
                    (fanfic["Author"] !== oldFanficData.Author) ))  ? true : false;

        newFic      &&    console.log(`New Fanfic: ${fanfic["FanficTitle"]} - Saving into the DB`);
        newFic      &&    log.info(`New Fanfic: ${fanfic["FanficID"]} - ${fanfic["FanficTitle"]}`);
        updated     &&    console.log(`Updated Fanfic - ${fanfic["FanficTitle"]} - Saving into the DB`);
        updated      &&   log.info(`Updated Fanfic: ${fanfic["FanficID"]} - ${fanfic["FanficTitle"]}`);
        console.log('updated',updated)
        console.log('newFic',newFic)

        fanfic["Status"] = newFic ? 'new' : updated ? 'updated' : 'old';
        
        console.log('Completed',fanfic["Complete"] !== oldFanficData.Complete)
        console.log('NumberOfChapters',fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters)
        console.log('FanficTitle',fanfic["FanficTitle"] !== oldFanficData.FanficTitle)
        
        if(!updated && !newFic){
            fanfic["StatusDetails"] = 'old';
        }else if(updated){
            fanfic["StatusDetails"] =   (fanfic["Complete"]) ? 'completed' :
                                        (fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters) ? 'chapter' :
                                        (fanfic["Author"] !== oldFanficData.Author) ? 'author' :
                                        (fanfic["FanficTitle"] !== oldFanficData.FanficTitle) ? 'title' : 'old';
        }else{
            fanfic["StatusDetails"] =   fanfic["Oneshot"] ? 'Oneshot' : 'new';
        }
       
        console.log('Status',fanfic["Status"]);
        console.log('Status Details',fanfic["StatusDetails"]);
        console.log(`------------------`)
        if(!fanfic['SavedFic']){
            return ([true,false,fanfic])
        }
        return ([newFic,updated,fanfic])
    // }else{
	// 	console.log('---- new fanfic');
	// 	let isNew = (savedFanficsLastUpdate===undefined) ? await mongoose.dbFanfics.collection(fandomName).findOne({FanficID: fanfic["FanficID"]}) :  null;
    //     if(isNew===null){
	// 		console.log('---- new fanfic');
	// 		return([true,false,fanfic])
    //     }else if(isNew['SavedFic']){
	// 		console.log('---- fanfic is not saved');
	// 		 return([false,true,fanfic]) 
	// 	} else{
    //         return([false,false,fanfic])          
    //     }
    // }
}
