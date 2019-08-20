const mongoose = require('../config/mongoose');
const Schema = mongoose.Schema;

const FanficSchema = new Schema({
    FandomName:             {type: String},
    FanficID:               {type: Number, unique: true},
    FanficTitle:            {type: String},
    URL:                    {type: String},
    Author:                 {type: String},
    AuthorURL:              {type: String},    
    NumberOfChapters:       {type: Number},    
    Complete:               {type: Boolean},    
    Rating:                 {type: String},    
    Tags:                   [],
    FandomsTags:            [],
    Language:               {type: String},    
    Hits:                   {type: Number},     
    Kudos:                  {type: Number},     
    Comments:               {type: Number},     
    Bookmarks:              {type: Number},     
    Words:                  {type: Number},     
    Description:            {type: String},          
    SavedFic:               {type: Boolean},
    fileName:               {type:String},
    savedAs:                {type:String},    
    NeedToSaveFlag:         {type: Boolean},
    PublishDate:            {type: Number},
    LastUpdateOfFic:        {type: Number},
    LastUpdateOfNote:       {type: Number},
    Source:                 {type: String},
    Oneshot:                {type: Boolean},
    Image:                  {type: String},      
    Status:                 {type: String},      
    StatusDetails:          {type: String},      
 });
 
 
 
//  let Fanfic = mongoose.dbFanfics.model('Fanfic', FanficSchema);

 
 
 module.exports = FanficSchema;
