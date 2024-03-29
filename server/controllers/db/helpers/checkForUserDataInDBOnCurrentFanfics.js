
const clc = require("cli-color");
const FandomUserData = require('../../../models/UserData');

exports.checkForUserDataInDBOnCurrentFanfics = async (userEmail,fanfics,type)=>{
    console.log(clc.xterm(175)('[db controller] checkForUserDataInDBOnCurrentFanfics()'));
    // let {userEmail} = req.query;   
    // let {fanfics} = req.body;   

    let data=[];
    
    return new Promise(function(resolve, reject) {
        let today = new Date(new Date().setHours(0,0,0,0)).getTime();

        FandomUserData.findOne({userEmail: userEmail}, async function(err, user) {  
            if (err) {  reject('there is an error'); }

            if (user) {
                console.log('found user!!, '+user.userEmail)
                const arrToLoop = (type==='update') ? user.FanficList : fanfics;
                const arrToCheck = (type==='update') ? fanfics : user.FanficList;
                arrToLoop.forEach(async function (fanfic){ 
                    let isExist = await arrToCheck.find(x => Number(x.FanficID) === Number(fanfic.FanficID));
                    if(isExist){
                        if(type==='update'){
                            addedDate = new Date(fanfic.Date);
                            addedDate = addedDate.getFullYear() + "/" + (addedDate.getMonth() + 1) + "/" + addedDate.getDate();
                            addedDate = new Date(fanfic.Date).getTime();
   
                            if(addedDate<today){data.push(isExist)}
                        }else{
                            data.push(isExist) 
                        }
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