const FandomUserData = require('../../../models/UserData');

exports.getUserFandomsFromDB = async (req,res) =>{
    console.log('getUserFandomsFromDB()')
    let fandoms = await this.getUserFandoms(req.query.userEmail);
    res.send(fandoms);
}

exports.getUserFandoms = (userEmail) =>{
    console.log('[db controller] getUserFandoms',userEmail)
    return new Promise(function(resolve, reject) {
        FandomUserData.findOne({userEmail: userEmail}, async function(err, user) { 
            if (err) {  console.log('there is an error in getReadingLists()');reject();}    
            if (user) {
                console.log('found user with fandoms list')
                resolve(user.Fandoms);
            }else{
                console.log('didnt found user');
                resolve([])
            }
        });
    });
}