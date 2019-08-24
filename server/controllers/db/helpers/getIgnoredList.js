const FandomUserData = require('../../../models/UserData');

exports.getIgnoredList = (userEmail) =>{
    return new Promise(function(resolve, reject) {
        FandomUserData.findOne({userEmail: userEmail}, async function(err, user) { 
            if (err) {  
                console.log('there is an error in getIgnoredList()')
                reject([]); 
            }    
            if (user) {
                resolve(user.FanficIgnoreList);
            }else{
                resolve([])
            }
        });
    });
}