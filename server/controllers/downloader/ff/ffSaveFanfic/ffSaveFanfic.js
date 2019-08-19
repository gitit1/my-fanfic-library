
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});

const {saveFanficToDB} = require('../../helpers/saveFanficToDB')
const {downloadFanfic} = require('../../helpers/downloadFanfic')

exports.ffSaveFanfic = async (fandomName,download,url,fandom) =>{ 
    return await new Promise(async function(resolve, reject) {  
        const status = await saveFanficToDB(fandomName,fandom);
        status && await updateFandomData(fandom)
        download=='true' && await downloadFanfic(url,fandom.Source,`${fandom.Author}_${fandom.FanficTitle} (${fandom.FanficID})`,'epub',fandom.FandomName,fandom.FanficID)     
        resolve();
    });
}


const updateFandomData = async (fandom) =>{
    const fandomName = fandom.FandomName;
    const isComplete = fandom.Complete ? 'FFCompleteFanfics' : 'FFOnGoingFanfics'

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