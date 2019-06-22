const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserFanficsSchema = new Schema({
  userEmail: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  FanficList: [
    {
      FandomName:       {type: String, unique: true},   
      FanficID:         {type: Number, unique: true},
      Favorite:         {type: Boolean},
      Status:           {type: String}, 
      ChapterStatus:    {type: Number},
      Image:            {type: String},
      SavedFic
    }
  ]
});

let UserFanfics = mongoose.dbUsers.model('User', UserFanficsSchema);

 
 
module.exports = UserFanfics;