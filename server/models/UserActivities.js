const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserActivitiesSchema = new Schema({
  userEmail: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  LatestActivities: [
    {
        Date:               {type: Number},
        FanficID:           {type: Number, unique: true},
        FandomName:         {type: String},
        ActivityType:       {type: String}  
    }
  ],
  ActivitiesArchive: [
    {
        Date:               {type: Number},
        FanficID:           {type: Number, unique: true},
        FandomName:         {type: String},
        ActivityType:       {type: String}      
    }
  ]
});

let UserActivities = mongoose.dbUsers.model('UserActivities', UserActivitiesSchema);

 
 
module.exports = UserActivities;