const mongoose = require('mongoose');
const Fanfic = require('./Fanfic');

const Schema = mongoose.Schema;

const FanficsSchema = new Schema({
    FandomName:         {type: String, unique: true},
    Fanfics:            [
        {
            FanficID:               {type: Number, unique: true},
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
         }
    ],         
    created: {
        type: Date,
        default: Date.now
     },
     lastUpdate: {type: Number}  
 });
 
 
 
 var Fanfics = mongoose.model('Fanfics', FanficsSchema);
 
 
 module.exports = Fanfics;
