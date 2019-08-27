

const {checkForUserDataInDBOnCurrentFanfics} = require('../../db/helpers/checkForUserDataInDBOnCurrentFanfics');
const {getlatestUpdates} = require('../latestUpdates/latestUpdates');

exports.myFanficsUpdate = async (req,res) =>{
    console.log('[db controller] - myFanficsUpdate');
    const {userEmail,limit,daysLimit} = req.query;
    let myFanficsUpdate = await getMyFanficsUpdate(userEmail,limit,daysLimit);

    res.send(myFanficsUpdate);
}

const getMyFanficsUpdate = async (userEmail,limit,daysLimit) =>{ 
    console.log('[db controller] - myFanficsUpdate - getMyFanficsUpdate');
    let fanficsArr = [];
    
    let latestUpdatedFics = await getlatestUpdates(daysLimit);
    await latestUpdatedFics.map(date=>date.Fandom.map(fandom=>{
        fanficsArr = fanficsArr.concat(fandom['FanficsIds'])
    }));
    let userFanfics = await checkForUserDataInDBOnCurrentFanfics(userEmail,fanficsArr,'update')
  
    return userFanfics.slice(0,limit);
}