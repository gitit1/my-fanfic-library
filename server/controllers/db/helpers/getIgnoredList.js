const FandomUserData = require('../../../models/UserData');

exports.getIgnoredList = (fandomName,userEmail) =>{
    console.log('[db controller] getIgnoredList')
    return new Promise(function(resolve, reject) {
        FandomUserData.findOne({userEmail: userEmail}, async function(err, user) { 
            if (err) {  
                console.log('there is an error in getIgnoredList()')
                reject([]); 
            }    
            if (user) {
                console.log('found user with ignore fanfics')
                ignoreList = await getIgnored(fandomName,user);
                resolve(ignoreList);
            }else{
                console.log('didnt found user')
                resolve([])
            }
        });
    });
}


const getIgnored = (fandomName,data) =>{
    return new Promise(function(resolve, reject) {
        console.log('getIgnored()');
        console.log('fandomName',fandomName);
        let ignored = [];

        data.FanficList.map(fic=>{
            if(fic.FandomName===fandomName){
                fic.Ignore && ignored.push(fic.FanficID);
            }
        })

        resolve(ignored);
    })

}