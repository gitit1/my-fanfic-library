const clc = require("cli-color");
const FandomUserData = require('../../../../models/UserData');
const {addActivityToUserActivities} = require('../addActivityToUserActivities');

exports.saveReadingListToDB = async (req,res) =>{
    console.log(clc.blue('[db controller] saveNewReadingListToDB()'));
    const {userEmail,fandomName,fanficId,author,fanficTitle,source,name} = req.query;
    console.log('userEmail,fandomName,fanficId,author,fanficTitle,source,name:',userEmail,fandomName,fanficId,author,fanficTitle,source,name)
    
    FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
        if (err) { return 'there is an error'; }

        if (user) {
            console.log('found user!!, '+user.userEmail)
            let isRLExist = await user.ReadingList.find(x => x.Name === name);
            let isFanficExist = await user.FanficList.find(x => x.FanficID === Number(fanficId));
            let isFanficInRL = isFanficExist && isFanficExist.ReadingList.includes(name);
            console.log('isFanficInRL:',isFanficInRL)
            let rlFanficsFandoms = isRLExist ? isRLExist.FanficsFandoms : [];
            let newFanficsFandomsArray=[]
            console.log('rlFanficsFandoms:',rlFanficsFandoms)
            isRLExist = (isRLExist===undefined) ? false : true; 
            isFanficExist = (isFanficExist===undefined||!isFanficExist) ? false : true;
            isFanficInRL = (isFanficInRL===undefined||!isFanficInRL) ? false : true; 

            if(!isRLExist && !isFanficExist){
                console.log('---RL - not exist, Fanfic not exsist , fanfic not in RL---')
                user.FanficList.push({
                    Date:           new Date().getTime(),
                    FanficID:       fanficId,
                    FandomName:     fandomName,
                    FanficTitle:    fanficTitle,
                    Author:         author,
                    Source:         source,
                    ReadingList:    name               
                });
                user.ReadingList.push({
                    Name:             name,
                    Date:             new Date().getTime(),
                    image:            null,
                    Fanfics:          fanficId,
                    FanficsFandoms:   [fandomName]
                });
                user.save();
                await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,source,'Reading List','true',name)
                res.send(true);                
            }else if(!isRLExist && isFanficExist){
                console.log('---RL - not exist, Fanfic exsist , fanfic not in RL---')
                FandomUserData.updateOne(
                    { userEmail: userEmail , "FanficList.FanficID": fanficId },
                    { $set:  {"FanficList.$.Date":new Date().getTime()},
                      $push: {"ReadingList": {"Name":name,"Date":new Date().getTime(),"image": null,"Fanfics":fanficId,"FanficsFandoms":[fandomName]},"FanficList.$.ReadingList": name}
                    },
                    async (err, result) => {
                        if (err) throw err;
                        console.log('User updated!');
                        await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,source,'Reading List','true',name)
                        res.send(true);
                     }
                 )
            }else if(isRLExist && isFanficExist && !isFanficInRL){
                console.log('---RL - exist, Fanfic exsist , fanfic not in RL---')
                
                if(rlFanficsFandoms.includes(fandomName)){newFanficsFandomsArray = rlFanficsFandoms}else{newFanficsFandomsArray = [...rlFanficsFandoms,fandomName]}

                FandomUserData.updateOne(
                    { userEmail: userEmail , "FanficList.FanficID": fanficId },
                    { $set:  {"FanficList.$.Date":new Date().getTime() },
                      $push: {"FanficList.$.ReadingList":name}
                    }, async (err, result) => {if (err) throw err;} )
                FandomUserData.updateOne({ userEmail: userEmail , "ReadingList.Name": name},
                 { $push:  {"ReadingList.$.Fanfics":fanficId , $set: {"ReadingList.$.FanficsFandoms": newFanficsFandomsArray}}},
                 async (err, result) => {if (err) throw err;}) 

                await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,source,'Reading List','true',name)
                res.send(true); 
            }else if(isRLExist && !isFanficExist){
                // console.log('rlFanficsFandoms.push(fandomName)',rlFanficsFandoms.push(fandomName))
                if(rlFanficsFandoms.includes(fandomName)){newFanficsFandomsArray = rlFanficsFandoms}else{newFanficsFandomsArray = [...rlFanficsFandoms,fandomName]}
                console.log('newFanficsFandomsArray',newFanficsFandomsArray)
                user.FanficList.push({
                    Date:           new Date().getTime(),
                    FanficID:       fanficId,
                    FandomName:     fandomName,
                    FanficTitle:    fanficTitle,
                    Author:         author,
                    Source:         source,
                    ReadingList:    name               
                });
                user.save();
                FandomUserData.updateOne({ userEmail: userEmail , "ReadingList.Name": name},
                                         { $set:    {"ReadingList.$.FanficsFandoms": newFanficsFandomsArray} , 
                                           $push:   {"ReadingList.$.Fanfics":fanficId}},
                                         async (err, result) => {if (err) throw err;})      
                await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,source,'Reading List','true',name)
                res.send(true);          
            }else{
                console.log('---RL - exist, Fanfic exsist , fanfic in RL---')
                res.send('already saved')
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
                    ReadingList:      name   
                },
                ReadingList: {
                    Name:             name,
                    Date:             new Date().getTime(),
                    image:            null,
                    Fanfics:          fanficId,
                    FanficsFandoms:   [fandomName]
                }
            });
            await newUser.save();
            await addActivityToUserActivities(userEmail,fanficId,author,fanficTitle,fandomName,source,'Reading List','true',name)
            res.send(true);
        }
    }) 
}

