const clc = require("cli-color");
const FandomUserData = require('../../../../models/UserData');
const {addActivityToUserActivities} = require('../addActivityToUserActivities');

exports.deleteReadingList = async (req,res) =>{
    console.log(clc.blue('[db controller] deleteReadingList()'));
    const {userEmail,name} = req.query;
    console.log('userEmail',userEmail);
    console.log('name',name);
    FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
        if (err) { return 'there is an error'; }

        if (user) {
            console.log('found user!!, '+user.userEmail)
            let userFanficData = [];
            user.FanficList.map(fanfic=>{
                if(fanfic.ReadingList.includes(name)){
                    fanfic.ReadingList = fanfic.ReadingList.filter(e => e !== name);
                    fanfic.Date = new Date().getTime();
                }
                userFanficData.push(fanfic);
            })
            let newReadingList = user.ReadingList.filter(e => e.Name !== name);
            FandomUserData.updateOne(
                { userEmail: userEmail},
                { $set:  {"FanficList": userFanficData,"ReadingList":newReadingList} },
                async (err, result) => {
                    if (err) throw err;
                    console.log('User updated!');
                    await addActivityToUserActivities(userEmail,null,null,null,null,null,'Reading List','remove',name)
                    res.send(true);
                 }
             )
        }else{
            console.log('didnt found user , creating new one!!')
            res.send(false);
        }
    }) 
}

