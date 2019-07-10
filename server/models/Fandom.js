const mongoose = require('../config/mongoose');

const Schema = mongoose.Schema;

const FandomSchema = new Schema({
    id:                     {type: Number},
    FandomName:             {type: String, unique: true},
    SearchKeys:             {type: String},
    AutoSave:               {type: Boolean},
    SaveMethod:             {type: String},
    Image_Name:             {type: String},
    FanficsInFandom:        {type: Number},
    OnGoingFanfics:         {type: Number},
    CompleteFanfics:        {type: Number},
    SavedFanfics:           {type: Number},    
    LastUpdate:             {type: Number},
    FanficsLastUpdate:      {type: Number},
    SavedFanficsLastUpdate: {type: Number}
 });
 
 
 
 var Fandom = mongoose.dbFandoms.model('Fandom', FandomSchema);
 
 
 module.exports = Fandom;
