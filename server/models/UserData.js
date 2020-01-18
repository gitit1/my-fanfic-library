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
      Date:             {type: Number, unique: true}, 
      FandomName:       {type: String},
      FanficID:         {type: Number},
      FanficTitle:      {type: String}, 
      Author:           {type: String}, 
      Source:           {type: String},          
      Follow:           {type: Boolean},
      Favorite:         {type: Boolean},
      Ignore:           {type: Boolean},
      Status:           {type: String}, 
      ChapterStatus:    {type: Number},
      Image:            {type: String},
      ReadingList:      [],
      SavedFic:         {type: Boolean},       
      SavedType:        [],
      Note:             {type: String}
    }
  ],
  Fandoms:          [],
  ReadingList:      [{
      Name:             {type: String},
      Date:             {type: Number},
      image:            {type: String},
      Fanfics:          [],
      FanficsFandoms:   []
  }],  
  FanficIgnoreList: []
});

let UserFanfics = mongoose.dbUsers.model('UserData', UserFanficsSchema);

 
 
module.exports = UserFanfics;


/*

{
    Name:{type: String, unique: true},
    Fanfics:[],
    createDate:{type: Number}
}

*/