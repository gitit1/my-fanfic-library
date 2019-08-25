const FandomUserData = require('../../../models/UserData');

exports.getIgnoredList = (userEmail) =>{
    console.log('[db controller] getIgnoredList')
    return new Promise(function(resolve, reject) {
        FandomUserData.findOne({userEmail: userEmail}, async function(err, user) { 
            console.log('hee')
            if (err) {  
                console.log('there is an error in getIgnoredList()')
                reject([]); 
            }    
            if (user) {
                console.log('found user with ignore fanfics')
                resolve(user.FanficIgnoreList);
            }else{
                console.log('didnt found user')
                resolve([])
            }
        });
    });
}