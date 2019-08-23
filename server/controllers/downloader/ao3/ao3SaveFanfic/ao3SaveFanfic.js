
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

const {saveFanficToServerHandler} = require('../helpers/saveFanficsToServer');
const {saveFanficToDB} = require('../../helpers/saveFanficToDB');


exports.ao3SaveFanfic = async (jar,fandomName,download,url,fanfic) =>{ 
    return await new Promise(async function(resolve, reject) {  
        if(download=='true'){
            await saveFanficToServerHandler(jar,url,fandomName,'epub','epub').then(async fanficInfo=>{
                if(Number(fanficInfo[0])>0){
                    fanfic["SavedFic"]   =   true
                    fanfic["NeedToSaveFlag"] = false
                    fanfic["fileName"] = fanficInfo[1];
                    fanfic["savedAs"] =  fanficInfo[2];
                    counter = 0
                }else{
                    fanfic["SavedFic"]   =   false
                    fanfic["NeedToSaveFlag"] = true               
                }
    
                saveFanficToDB(fandomName,fanfic).then(async () =>{
                    await updateFandomData(fanfic);
                    resolve()
                }).catch(error=>{
                    console.log('error:::',error)
                    reject()
                })
            })
        }else{
            fanfic["SavedFic"]   =   false
            fanfic["NeedToSaveFlag"] = true  
            saveFanficToDB(fandomName,fanfic).then(async () =>{
                await updateFandomData(fanfic);
                resolve()
            }).catch(error=>{
                console.log('error:::',error)
                reject()
            })
        }
    });
    
}

//TODO: add save method here and in ff

const updateFandomData = async (fanfic) =>{
    const fandomName = fanfic.FandomName;
    const isComplete = fanfic.Complete ? 'AO3CompleteFanfics' : 'AO3OnGoingFanfics'

    const fanficsInFandom = await mongoose.dbFanfics.collection(fandomName).countDocuments({});
    const AO3FanficsInFandom = await mongoose.dbFanfics.collection(fandomName).countDocuments({'Source':'AO3'});

    const ao3Num = (isComplete==='AO3CompleteFanfics')
    ? await mongoose.dbFanfics.collection(fandomName).countDocuments({'Source':'AO3','Complete':true})
    : await mongoose.dbFanfics.collection(fandomName).countDocuments({'Source':'AO3','Complete':false});



    await FandomModal.updateOne(   { 'FandomName': fandomName },
                                    {
                                        $set: { 'FanficsInFandom':fanficsInFandom,
                                                'AO3FanficsInFandom':AO3FanficsInFandom,
                                                [isComplete]:ao3Num
                                              },
                                    }
                                ,(err, result) => {if (err) throw err;});

    return null;
}