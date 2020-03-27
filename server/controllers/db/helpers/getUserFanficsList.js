const FandomUserData = require('../../../models/UserData');

exports.getUserFanficsList = (userEmail) =>{
    console.log('[db controller] getUserFanficsList')
    return new Promise(function(resolve, reject) {
        FandomUserData.findOne({userEmail: userEmail}, async function(err, user) { 
            if (err) {  
                console.log('there is an error in getUserFanficsList()')
                reject([]); 
            }    
            if (user) {
                console.log('found user with ignore fanfics')
                let newFilteredArray=[]
                user.FanficList.map(fanfic=>{
                    ((fanfic.Status!=="Need to Read") || fanfic.Favorite || (fanfic.Status===undefined && fanfic.Favorite)) && newFilteredArray.push(fanfic.FanficID)
                })
                resolve(newFilteredArray);
            }else{
                console.log('didnt found user')
                resolve([])
            }
        });
    });
}