const mongoose = require('../config/mongoose');
const Schema = mongoose.Schema;

const FanficSchema = new Schema({
    FandomName:             {type: String},
    FanficID:               {type: Number, unique: true},
    FanficID_FF:            {type: Number},
    FanficTitle:            {type: String},
    URL:                    {type: String},
    URL_FF:                 {type: String},
    Author:                 {type: String},
    AuthorURL:              {type: String},    
    AuthorURL_FF:           {type: String},    
    NumberOfChapters:       {type: Number},    
    HasFFLink:              {type: Boolean},    
    Complete:               {type: Boolean},    
    Rating:                 {type: String},  
    Categories:             [],  
    Tags:                   [],
    FandomsTags:            [],
    Language:               {type: String},    
    Hits:                   {type: Number},     
    Kudos:                  {type: Number},     
    Comments:               {type: Number},     
    Bookmarks:              {type: Number},     
    Words:                  {type: Number},     
    Description:            {type: String}, 
    Series:                 {type: String},         
    SeriesPart:             {type: Number},         
    SeriesURL:              {type: String},         
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
    Deleted:                {type: Boolean}, 
    image:                  {type: String}     
 });
 
 
 
//  let Fanfic = mongoose.dbFanfics.model('Fanfic', FanficSchema);

 
 
 module.exports = FanficSchema;
