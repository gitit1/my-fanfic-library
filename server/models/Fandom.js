const mongoose = require('../config/mongoose');

const Schema = mongoose.Schema;

const FandomSchema = new Schema({
    id:                         {type: Number},
    FandomName:                 {type: String, unique: true},
    SearchKeys:                 {type: String},
    AutoSave:                   {type: Boolean},
    SaveMethod:                 {type: String},
    Image_Name_Main:            {type: String},
    Image_Name_Icon:            {type: String},
    FanficsInFandom:            {type: Number},
    AO3FanficsInFandom:         {type: Number},
    AO3OnGoingFanfics:          {type: Number},
    AO3CompleteFanfics:         {type: Number},
    AO3DeletedFanfics:          {type: Number},
    AO3SavedFanfics:            {type: Number},
    FFFanficsInFandom:          {type: Number}, 
    FFOnGoingFanfics:           {type: Number},
    FFCompleteFanfics:          {type: Number},
    FFDeletedFanfics:           {type: Number},
    FFSavedFanfics:             {type: Number},
    AO3:                     {
                                    FanficsInFandom:  {type: Number},
                                    OnGoingFanfics:   {type: Number},
                                    CompleteFanfics:  {type: Number},
                                    SavedFanfics:     {type: Number},
    },
    FF:                     {
                                    FanficsInFandom:  {type: Number},
                                    OnGoingFanfics:   {type: Number},
                                    CompleteFanfics:  {type: Number},
                                    SavedFanfics:     {type: Number},
    },
    Backup:                     {
                                    FanficsInFandom:  {type: Number},
                                    OnGoingFanfics:   {type: Number},
                                    CompleteFanfics:  {type: Number},
                                    SavedFanfics:     {type: Number},
    },
    Patreon:                    {
                                    FanficsInFandom:  {type: Number},
                                    OnGoingFanfics:   {type: Number},
                                    CompleteFanfics:  {type: Number},
                                    SavedFanfics:     {type: Number},
    },                                 
    LastUpdate:                 {type: Number},
    FanficsLastUpdate:          {type: Number},
    SavedFanficsLastUpdate:     {type: Number}
 });
 
 
 
 var Fandom = mongoose.dbFandoms.model('Fandom', FandomSchema);
 
 
 module.exports = Fandom;
