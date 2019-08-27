
const UserActivitiesDB = require('../../../models/UserActivities');

exports.myLatestActivities = async (req,res) =>{
    console.log('[db controller] - myLatestActivities')
    const {limit,userEmail} = req.query;
    let myLatestActivities = await getMyLatestActivities(limit,userEmail);

    res.send(myLatestActivities);
}

const getMyLatestActivities = async (limit,userEmail) =>{ 
    console.log('[db controller] - myLatestActivities - getMyLatestActivities')
    console.log('limit',limit)
        limit = Number(limit);
        

        return UserActivitiesDB.aggregate( [ { $match : { userEmail : userEmail } },
            { $unwind : "$LatestActivities" } ,
            { $sort : { 'LatestActivities.Date' : -1} },
            { $limit : limit },
            { $project : { _id: 0,'Date':'$LatestActivities.Date',
                                  'FanficID':'$LatestActivities.FanficID',
                                  'Author':'$LatestActivities.Author',
                                  'FanficTitle':'$LatestActivities.FanficTitle',
                                  'FandomName':'$LatestActivities.FandomName',
                                  'Source':'$LatestActivities.Source',
                                  'ActivityType':'$LatestActivities.ActivityType'} }]
        , async function(err, filtered) {
            // console.log('got it',filtered)
            return filtered
        }) 

}