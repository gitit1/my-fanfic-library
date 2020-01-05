
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

const {saveFanficToDB} = require('../../helpers/saveFanficToDB')
const {downloadFanfic} = require('../../helpers/downloadFanfic')


exports.ffSaveFanfic = async (fandomName,download,url,fanfic) =>{ 
    return await new Promise(async function(resolve, reject) {  
        const {Source, Author, FanficTitle, FanficID} = fanfic;
        const status = await saveFanficToDB(fandomName,fanfic);
        status && await updateFandomData(fanfic);
        download=='true' && await downloadFanfic(url, Source, `${Author}_${FanficTitle} (${FanficID})`, 'epub', fandomName, FanficID)     
        download=='true' && await downloadFanfic(url, Source, `${Author}_${FanficTitle} (${FanficID})`, 'pdf', fandomName, FanficID)     
        resolve();
    });
}


const updateFandomData = async (fanfic) =>{
    const fandomName = fanfic.FandomName;
    const isComplete = fanfic.Complete ? 'FF.CompleteFanfics' : 'FF.OnGoingFanfics'

    await FandomModal.updateOne({ 'FandomName': fandomName },
                                    {
                                        $inc: { 'FanficsInFandom':1,
                                                'FF.FanficsInFandom':1,
                                                [isComplete]:1
                                              },
                                    });

    return null;
}

//TODO: CHANGE FROM EPUB TO USER CHOICE
//TODO: multi downaload (epub+pdf)...