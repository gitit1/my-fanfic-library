const mongoose = require('../config/mongoose');
const Schema = mongoose.Schema;

const FanficSchema = new Schema({
    FandomName:             {type: String},
    FanficID:               {type: Number, unique: true},
    FanficTitle:            {type: String},
    Favorite:               {type: Boolean},
    URL:                    {type: String},
    Author:                 {type: String},
    AuthorURL:              {type: String},    
    NumberOfChapters:       {type: Number},    
    Complete:               {type: Boolean},    
    Rating:                 {type: String},    
    Tags:                   [], 
    Language:               {type: String},    
    Hits:                   {type: Number},     
    Kudos:                  {type: Number},     
    Comments:               {type: Number},     
    Words:                  {type: String},     
    Description:            {type: String},     
    Image:                  {type: String},     
    Status:                 {type: String},
    ChapterStatus:          {type: Number},
    SavedFic:               {type: Boolean},
    LastUpdateOfFic:        {type: Number},
    LastUpdateOfNote:       {type: Number},
 });
 
 
 
//  let Fanfic = mongoose.dbFanfics.model('Fanfic', FanficSchema);

 
 
 module.exports = FanficSchema;
