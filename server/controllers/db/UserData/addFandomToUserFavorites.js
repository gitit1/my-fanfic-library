
const clc = require("cli-color");
const FandomUserData = require('../../../models/UserData');
const {addActivityToUserActivities} = require('./addActivityToUserActivities');

exports.addFandomToUserFavorites = async (req,res) =>{
    console.log(clc.blue('[db controller - UserData] addFandomToUserFavorites()'));
    const {userEmail,fandomName,status} = req.query;
    console.log('------userEmail,fandomName,status:',userEmail,fandomName,status)

    FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
        if (err) { return 'there is an error'; }

        if (user) {
            userFandoms = [...user.Fandoms];
            console.log('status:',status)
            if(status==='true'){
                console.log('------true:')
                user.Fandoms.push(fandomName);
                console.log('user.Fandoms',user.Fandoms)
                user.save();
                await addActivityToUserActivities(userEmail,0,'','',fandomName,'','Fandom','true')
            }else{
                console.log('------false:')
                userFandoms = userFandoms.filter(f => {return f !== fandomName});
                console.log('userFandoms',userFandoms)
                console.log('user.Fandoms',user.Fandoms)
                user.Fandoms = userFandoms;
                console.log('user.Fandoms 2',user.Fandoms)
                user.save();
                await addActivityToUserActivities(userEmail,0,'','',fandomName,'','Fandom','false')          
            }

            res.send(true);  
        }else{
            console.log('didnt found user , creating new one!!')
            const newUser = new FandomUserData({
                userEmail: userEmail,
                Fandoms: [fandomName]
            });
            await newUser.save();
            await addActivityToUserActivities(userEmail,0,'','',fandomName,'','Fandom','true')
            res.send(true);
        }
    }) 
}