const UserActivitiesDB = require('../../../models/UserActivities');

exports.addActivityToUserActivities = (userEmail,fanficId,fanficTitle,fandomName,type,typeFlag,chapter) =>{
    return new Promise(function(resolve, reject) {
        console.log('addActivityToUserActivities')
        let activity='';
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
            default:
                break;
        }
        console.log(userEmail,fanficId,fanficTitle,activity)
        UserActivitiesDB.findOne({userEmail: userEmail}, async function(err, user) {  
            if (err) { return 'there is an error'; }
            if (user) {
                console.log('found user!!, '+user.userEmail)
                activity = {
                        Date:               new Date().getTime(),
                        FanficID:           fanficId,
                        FanficTitle:        fanficTitle,
                        FandomName:         fandomName,
                        ActivityType:       activity  
                }
                UserActivitiesDB.updateOne({userEmail: userEmail},
                    { $push: { "LatestActivities": fanficId }},saveAs,(err, result) => {
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
                            FanficTitle:        fanficTitle,
                            FandomName:         fandomName,
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