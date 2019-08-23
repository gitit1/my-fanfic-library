
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

const {saveFanficToDB} = require('../../helpers/saveFanficToDB')
const {downloadFanfic} = require('../../helpers/downloadFanfic')

exports.ffSaveFanfic = async (fandomName,download,url,fanfic) =>{ 
    return await new Promise(async function(resolve, reject) {  
        const status = await saveFanficToDB(fandomName,fanfic);
        status && await updateFandomData(fanfic)
        download=='true' && await downloadFanfic(url,fanfic.Source,`${fanfic.Author}_${fanfic.FanficTitle} (${fanfic.FanficID})`,'epub',fanfic.FandomName,fanfic.FanficID)     
        resolve();
    });
}


const updateFandomData = async (fanfic) =>{
    const fandomName = fanfic.FandomName;
    const isComplete = fanfic.Complete ? 'FFCompleteFanfics' : 'FFOnGoingFanfics'

    const fanficsInFandom = await mongoose.dbFanfics.collection(fandomName).countDocuments({});
    const FFFanficsInFandom = await mongoose.dbFanfics.collection(fandomName).countDocuments({'Source':'FF'});

    const ffNum = (isComplete==='FFCompleteFanfics')
    ? await mongoose.dbFanfics.collection(fandomName).countDocuments({'Source':'FF','Complete':true})
    : await mongoose.dbFanfics.collection(fandomName).countDocuments({'Source':'FF','Complete':false});



    await FandomModal.updateOne(   { 'FandomName': fandomName },
                                    {
                                        $set: { 'FanficsInFandom':fanficsInFandom,
                                                'FFFanficsInFandom':FFFanficsInFandom,
                                                [isComplete]:ffNum
                                              },
                                    }
                                ,(err, result) => {if (err) throw err;});

    return null;
}

//TODO: CHANGE FROM EPUB TO USER CHOICE
//TODO: multi downaload (epub+pdf)...