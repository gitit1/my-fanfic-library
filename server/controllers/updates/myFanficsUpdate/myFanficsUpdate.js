

const {checkForUserDataInDBOnCurrentFanfics} = require('../../db/helpers/checkForUserDataInDBOnCurrentFanfics');
const {getlatestUpdates} = require('../latestUpdates/latestUpdates');

exports.myFanficsUpdate = async (req,res) =>{
    console.log('[db controller] - myLatestActivities');
    const {userEmail,limit,daysLimit} = req.query;
    let myLatestActivities = await getMyFanficsUpdate(userEmail,limit,daysLimit);

    res.send(myLatestActivities);
}

const getMyFanficsUpdate = async (userEmail,limit,daysLimit) =>{ 
    userEmail='git@test.com',daysLimit=5;
    let fanficsArr = [];
    
    let latestUpdatedFics = await getlatestUpdates(daysLimit);
    await latestUpdatedFics.map(date=>date.Fandom.map(fandom=>{
        fanficsArr = fanficsArr.concat(fandom['FanficsIds'])
    }));
    let userFanfics = await checkForUserDataInDBOnCurrentFanfics(userEmail,fanficsArr,'update')
    // console.log('userFanfics',userFanfics)

    
    return userFanfics.slice(0,limit);
}