const mongoose = require('../config/mongoose');

const Schema = mongoose.Schema;

const FandomSchema = new Schema({
    FandomName:                 {type: String, unique: true},
    SearchKeys:                 {type: String},
    AutoSave:                   {type: Boolean},
    SaveMethod:                 {type: String},
    Image_Name_Main:            {type: String},
    Image_Name_Icon:            {type: String},
    FanficsInFandom:            {type: Number},
    AO3:                     {
                                    FanficsInFandom:  {type: Number},
                                    OnGoingFanfics:   {type: Number},
                                    CompleteFanfics:  {type: Number},
                                    SavedFanfics:     {type: Number},
                                    DeletedFanfics:   {type: Number}     
    },
    FF:                     {
                                    FanficsInFandom:  {type: Number},
                                    OnGoingFanfics:   {type: Number},
                                    CompleteFanfics:  {type: Number},
                                    SavedFanfics:     {type: Number},
                                    DeletedFanfics:   {type: Number}
    },
    Backup:                     {
                                    FanficsInFandom:  {type: Number},
                                    OnGoingFanfics:   {type: Number},
                                    CompleteFanfics:  {type: Number},
                                    SavedFanfics:     {type: Number},
                                    DeletedFanfics:   {type: Number}
    },
    Patreon:                    {
                                    FanficsInFandom:  {type: Number},
                                    OnGoingFanfics:   {type: Number},
                                    CompleteFanfics:  {type: Number},
                                    SavedFanfics:     {type: Number},
                                    DeletedFanfics:   {type: Number}
    },                                 
    LastUpdate:                 {type: Number},
    FanficsLastUpdate:          {type: Number},
    SavedFanficsLastUpdate:     {type: Number}
 });
 
 
 
 var Fandom = mongoose.dbFandoms.model('Fandom', FandomSchema);
 
 
 module.exports = Fandom;
