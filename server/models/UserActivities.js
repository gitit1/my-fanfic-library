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
        Date:               {type: Number, unique: true},
        FandomName:         {type: String},
        FanficID:           {type: Number},
        FanficTitle:        {type: String},
        Author:             {type: String},
        Source:             {type: String},           
        ActivityType:       {type: String}  
    }
  ],
  ActivitiesArchive: [
    {
        Date:               {type: Number},
        FanficID:           {type: Number},
        Author:             {type: String},
        FanficTitle:        {type: String},
        FandomName:         {type: String},
        ActivityType:       {type: String}      
    }
  ]
});

let UserActivities = mongoose.dbUsers.model('UserActivities', UserActivitiesSchema);

 
 
module.exports = UserActivities;