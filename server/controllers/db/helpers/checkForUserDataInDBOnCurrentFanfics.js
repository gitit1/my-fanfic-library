
const clc = require("cli-color");
const FandomUserData = require('../../../models/UserData');

exports.checkForUserDataInDBOnCurrentFanfics = async (userEmail,fanfics)=>{
    console.log(clc.blue('[db controller] checkForUserDataInDBOnCurrentFanfics()'));
    // let {userEmail} = req.query;   
    // let {fanfics} = req.body;   

    let data=[];
    
    return new Promise(function(resolve, reject) {
        FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
            if (err) {  reject('there is an error'); }

            if (user) {
                console.log('found user!!, '+user.userEmail)
                fanfics.forEach(async function (fanfic){ 
                    let isExist = await user.FanficList.find(x => Number(x.FanficID) === Number(fanfic.FanficID));
                    if(isExist){
                        data.push(isExist)
                    }
                });
                 resolve(data)
                
            }else{
                console.log('didnt found user , no personal data yet!!')
                resolve([])
            }
        }) 
    });
}