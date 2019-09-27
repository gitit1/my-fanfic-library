const UserData = require('../../../models/UserData');

exports.getFullUserDataFromDB = async (req,res) =>{
    console.log('getFullUserDataFromDB()')
    let userData = await this.getFullUserData(req.query.userEmail);
    res.send(userData);
}

exports.getFullUserData = (userEmail) =>{
    console.log('[db controller] getUserFandoms',userEmail)
    return new Promise(function(resolve, reject) {
        UserData.findOne({userEmail: userEmail}, async function(err, user) { 
            console.log('hee')
            if (err) {  console.log('there is an error in getReadingLists()');reject();}    
            if (user) {
                console.log('found user with fandoms list')
                resolve(user);
            }else{
                console.log('didnt found user');
                resolve([])
            }
        });
    });
}