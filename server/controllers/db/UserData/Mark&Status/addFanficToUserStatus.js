const clc = require("cli-color");
const FandomUserData = require('../../../../models/UserData');
const {addActivityToUserActivities} = require('../addActivityToUserActivities');

exports.addFanficToUserStatus = async (req,res)=>{
    console.log(clc.blue('[db controller] addFanficToUserStatus()'));
    let {userEmail,fanficId,author,fanficTitle,fandomName,source,statusType,status,data} = req.query;

    FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
        if (err) { return 'there is an error'; }

        if (user) {
            console.log('found user!!, '+user.userEmail)
            let isExist = await user.FanficList.find(x => x.FanficID === Number(fanficId));
            // console.log('isExist?, '+isExist)
            if(!isExist){
                console.log('not exist!!')
                user.FanficList.push({
                    Date: new Date().getTime(),
                    FanficID:       fanficId,
                    FandomName:     fandomName,
                    FanficTitle:    fanficTitle,
                    Author:         author,
                    Source:         source,
                    Status:         status,
                    ChapterStatus: (data!==undefined) ? Number(data) : undefined                 
                });
                user.save();
                await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,source,statusType,status,data)
                res.send(true);
            }else{
                console.log('exist!!')
                FandomUserData.updateOne(
                    { userEmail: userEmail , "FanficList.FanficID": fanficId },
                    { $set: {"Date":new Date().getTime(),"FanficList.$.Status": status,"FanficList.$.ChapterStatus": (data!==undefined)?Number(data):undefined }},
                    (err, result) => {
                        if (err) throw err;
                        console.log('User updated!');
                     }
                 )
                 await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,source,statusType,status,data)
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
                    FanficTitle:      fanficTitle,
                    Author:           author,
                    Source:           source,
                    Status:           status,
                    ChapterStatus: (data!==undefined) ? Number(data) : undefined   
                }
            });
            await newUser.save();
            await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,source,statusType,status,data)
            res.send(true);
        }
    }) 

}