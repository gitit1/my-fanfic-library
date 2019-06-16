const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FandomSchema = new Schema({
    id:                 {type: Number},
    FandomName:         {type: String, unique: true},
    SearchKeys:         {type: String},
    AutoSave:           {type: String},
    SaveMethod:         {type: String},
    Image_Name:         {type: String},
    FanficsInFandom:    {type: Number},
    OnGoingFanfics:     {type: Number},
    CompleteFanfics:    {type: Number},
    SavedFanfics:       {type: Number},    
    LastUpdate:         {type: Number}
 });
 
 
 
 var Fandom = mongoose.model('Fandom', FandomSchema);
 
 
 module.exports = Fandom;
