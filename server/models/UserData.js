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
      FanficID:         {type: Number, unique: true},
      FandomName:       {type: String},
      Favorite:         {type: Boolean},
      Ignore:           {type: Boolean},
      Status:           {type: String}, 
      ChapterStatus:    {type: Number},
      Image:            {type: String},
      SavedFic:         {type: Boolean},       
      SavedType:        [],
      ReadingList:      [],       
    }
  ],
  FanficIgnoreList: []
});

let UserFanfics = mongoose.dbUsers.model('UserData', UserFanficsSchema);

 
 
module.exports = UserFanfics;