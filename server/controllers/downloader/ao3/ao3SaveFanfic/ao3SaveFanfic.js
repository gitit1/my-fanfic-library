
const FandomModal = require('../../../../models/Fandom');

const {saveFanficToServerHandler} = require('../helpers/saveFanficsToServer');
const {saveFanficToDB} = require('../../helpers/saveFanficToDB');
const {getUrlBodyFromAo3} = require('../helpers/getUrlBodyFromAo3')
 
exports.ao3SaveFanfic = async (jar,fandomName,download,url,fanfic) =>{ 
    console.log('fandomName,download,url,fanfic:',fandomName,download,url,fanfic)
    return await new Promise(async function(resolve, reject) {  
        if(download=='true'){
            let urlBody = await getUrlBodyFromAo3(jar,url) //TODO: fix it 'epub'
            await saveFanficToServerHandler(jar,url,urlBody, fandomName,'epub','epub').then(async fanficInfo=>{
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
    const isComplete = fanfic.Complete ? 'AO3.CompleteFanfics' : 'AO3.OnGoingFanfics'

    await FandomModal.updateOne({ 'FandomName': fandomName },
                                    {
                                        $inc: { 'FanficsInFandom':1,
                                                'AO3.FanficsInFandom':1,
                                                [isComplete]:1
                                              },
                                    });

    return null;
}