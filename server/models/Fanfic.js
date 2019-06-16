const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FanficSchema = new Schema({
    FanficID:               {type: Number},
    LastUpdateOfNote:       {type: Number},
    LastUpdateOfFic:        {type: Number},
    Favorite:               {type: Boolean},
    Status:                 {type: String},
    ChapterStatus:          {type: Number},
    SavedFic:               {type: Boolean},
    FanficTitle:            {type: String},
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
 });
 
 
 
 let Fanfic = mongoose.model('Fanfic', FanficSchema);
 
 
 module.exports = Fanfic;
