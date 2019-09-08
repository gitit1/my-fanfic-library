const UserActivitiesDB = require('../../../models/UserActivities');

exports.addActivityToUserActivities = (userEmail,fanficId,author,fanficTitle,fandomName,source,type,typeFlag,chapter) =>{
    return new Promise(function(resolve, reject) {
        console.log('addActivityToUserActivities')
        console.log(userEmail,fanficId,author,fanficTitle,fandomName,source,type,typeFlag,chapter)
        let activity='';
        typeFlag = (typeFlag==='true'||typeFlag==='Finished'||typeFlag==='In Progress') ? true : false;
        switch (type) {
            case 'Favorite':
                activity = typeFlag ? 'Favorite' : 'Unfavorite'
                break;
            case 'Follow':
                activity = typeFlag ? 'Follow' : 'Unfollow'
                break;
            case 'Ignore':
                activity = typeFlag ? 'Ignore' : 'Unignore'
                break;  
            case 'Finished':
                activity = typeFlag ? 'Finished' : 'Unfinished'
                break;
            case 'In Progress':
                activity = typeFlag ? `In Progress - ${chapter}` : 'Need to Read'
                break;  
            case 'Reading List':
                activity = typeFlag ? `Added - ${chapter}` : `Removed - ${chapter}` ;
            case 'Fandom':
                activity = typeFlag ? `Added - ${fandomName}` : `Removed - ${fandomName}` ;                
            default:
                break;
        }

        UserActivitiesDB.findOne({userEmail: userEmail}, async function(err, user) {  
            if (err) { return 'there is an error'; }
            if (user) {
                console.log('found user!!, '+user.userEmail)
                console.log('type!!, '+type)
               const userActivity = (type==='Fandom') 
                                     ? {Date:Number(new Date().getTime()),FandomName:fandomName,ActivityType:activity }
                                     : {Date:Number(new Date().getTime()),FanficID:Number(fanficId),Author:author,FanficTitle:fanficTitle,
                                        FandomName:fandomName,Source:source,ActivityType:activity  }

                UserActivitiesDB.updateOne({userEmail: userEmail},
                    { $push: { "LatestActivities": userActivity }},(err, result) => {
                        if (err) throw err;
                        console.log('User updated!');
                     }
                 )
            }else{
                console.log('didnt found user , creating new one!!')
                const newUser = new UserActivitiesDB({
                    userEmail: userEmail,
                    LatestActivities: [
                        {
                            Date:               new Date().getTime(),
                            FanficID:           fanficId,
                            Author:             author,
                            FanficTitle:        fanficTitle,
                            FandomName:         fandomName,
                            Source:             source,
                            ActivityType:       activity  
                        }
                    ]
                });
                await newUser.save();
            }
        });
        resolve()
    });
}