const clc = require("cli-color");
const FandomUserData = require('../../../models/UserData');
const {addActivityToUserActivities} = require('./addActivityToUserActivities');

exports.addFanficToUserMarksInDB = async (req,res)=>{
    console.log(clc.blue('[db controller] addFanficToUserFavoritesInDB()'));
    let {userEmail,fanficId,author,fanficTitle,fandomName,markType,mark} = req.query,saveAs;
    fanficId = Number(fanficId)
    FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
        if (err) { return 'there is an error'; }
        if (user) {
            console.log('found user!!, '+user.userEmail)
            let isExist = await user.FanficList.find(x => x.FanficID === fanficId);
            // console.log('isExist?, '+isExist)
            if(!isExist){
                console.log('not exist!!')
                user.FanficList.push({
                    Date: new Date().getTime(),
                    FanficID: fanficId,
                    FandomName: fandomName,
                    [markType]: Boolean(mark)                     
                });
                if(markType==='Ignore' && mark){
                    user.FanficIgnoreList.push(fanficId);
                }
                user.save();
                await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,markType,mark)
                res.send(true);
            }else{
                //TODO: function to clean "empty" userdata in userdataDb (if all settings are init not needed)
                switch (markType) {
                    case 'Favorite':
                        saveAs = {"FanficList.$.Favorite":mark,"Date":new Date().getTime()}
                        break;
                    case 'Follow':
                        saveAs = {"FanficList.$.Follow":mark,"Date":new Date().getTime()}
                        break;
                    case 'Ignore':           
                        if(markType==='Ignore' && mark==='true'){
                            saveAs = { $set: {"FanficList.$.Ignore":mark,"Date":new Date().getTime()}, $push: {"FanficIgnoreList":fanficId} }
                        }else if(markType==='Ignore' && mark==='false'){
                            saveAs = {$set: {"FanficList.$.Ignore":mark,"Date":new Date().getTime()}, $pull: {"FanficIgnoreList":fanficId} }
                        }
                        break;
                }

                console.log('exist!!')
                console.log('saveAs:',saveAs)
                FandomUserData.updateOne(
                    { userEmail: userEmail , "FanficList.FanficID": fanficId },saveAs,(err, result) => {
                        if (err) throw err;
                        console.log('User updated!');
                     }
                 )
                await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,markType,mark)
                res.send(true);
            }
        }else{
            console.log('didnt found user , creating new one!!')
            const newUser = new FandomUserData({
                userEmail: userEmail,
                FanficList: {
                    Date:             new Date().getTime(),
                    FanficID:         fanficId,
                    FandomName:       fandomName,
                    [markType]:       Boolean(mark)   
                },
                FanficIgnoreList: (markType==='Ignore' && mark) ? fanficId : undefined
            });
            await newUser.save();
            await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,markType,mark)
            res.send(true);
         }
    }) 
}