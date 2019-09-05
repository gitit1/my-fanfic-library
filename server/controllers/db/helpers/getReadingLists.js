const FandomUserData = require('../../../models/UserData');

exports.getReadingLists = (userEmail) =>{
    console.log('[db controller] getReadingLists')
    return new Promise(function(resolve, reject) {
        FandomUserData.findOne({userEmail: userEmail}, async function(err, user) { 
            console.log('hee')
            if (err) {  
                console.log('there is an error in getReadingLists()')
                reject([]); 
            }    
            if (user) {
                console.log('found user with reading lists fanfics')
                const readingList = user.ReadingList.map(rl=>rl.Name);
                resolve(readingList);
            }else{
                console.log('didnt found user')
                resolve([])
            }
        });
    });
}