
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

const {saveFanficToDB} = require('../../helpers/saveFanficToDB')

exports.saveNewFanfic = async (fandomName,download,fanfic) =>{ 
    return await new Promise(async function(resolve, reject) {  
        console.log('[Manually] - saveNewFanfic')
        fanfic['status'] = 'old';
        const status = await saveFanficToDB(fandomName,fanfic);
        status && await updateFandomData(fanfic)
        resolve();
    });
}


const updateFandomData = async (fanfic) =>{
    console.log('[Manually] - updateFandomData')
    const fandomName = fanfic.FandomName;
    const isComplete = fanfic.Complete ? `${fanfic.Source}.CompleteFanfics` : `${fanfic.Source}.OnGoingFanfics`
    const fanficsInFandom = `${fanfic.Source}.FanficsInFandom`;
    await FandomModal.updateOne({ 'FandomName': fandomName },
                                {
                                    $inc: { 'FanficsInFandom':1,
                                            [fanficsInFandom]:1,
                                            [isComplete]:1
                                          },
                                });

    return null;
}
