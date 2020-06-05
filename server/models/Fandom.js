const mongoose = require('../config/mongoose');

const Schema = mongoose.Schema;

const FandomSchema = new Schema({
    FandomName:                 {type: String, unique: true},
    FandomUniverse:             {type: String},
    SearchKeys:                 {type: String},
    AutoSave:                   {type: Boolean},
    SaveMethod:                 {type: String},
    FanficsInFandom:            {type: Number},
    Collection:                 {type: String},
    FFSearchUrl:                {type: String},
    Priority:                   {type:Number},
    Info:                       {
                                    Year:                       {type: Number},
                                    Canon:                      {type: Boolean},                              
                                    Main:                       {type: Boolean},                              
                                    Type:                       {type: String},
                                    Categories:                 {type: String},
                                    Summary:                    {type: String},                                
    },
    AO3:                     {
                                    TotalFanficsInFandom:   {type: Number},
                                    FanficsInSite:          {type: Number},         
                                    OnGoingFanfics:         {type: Number},
                                    CompleteFanfics:        {type: Number},
                                    SavedFanfics:           {type: Number},
                                    DeletedFanfics:         {type: Number}     
    },
    FF:                     {
                                    TotalFanficsInFandom:   {type: Number},
                                    FanficsInSite:          {type: Number},  
                                    OnGoingFanfics:         {type: Number},
                                    CompleteFanfics:        {type: Number},
                                    SavedFanfics:           {type: Number},
                                    DeletedFanfics:         {type: Number}
    },
    Patreon:                    {
                                    TotalFanficsInFandom:   {type: Number},
                                    FanficsInSite:          {type: Number},  
                                    OnGoingFanfics:         {type: Number},
                                    CompleteFanfics:        {type: Number},
                                    SavedFanfics:           {type: Number},
                                    DeletedFanfics:         {type: Number}
    },
    Tumblr:                    {
                                    TotalFanficsInFandom:   {type: Number},
                                    FanficsInSite:          {type: Number},  
                                    OnGoingFanfics:         {type: Number},
                                    CompleteFanfics:        {type: Number},
                                    SavedFanfics:           {type: Number},
                                    DeletedFanfics:         {type: Number}
    },
    Wattpad:                    {
                                    TotalFanficsInFandom:   {type: Number},
                                    FanficsInSite:          {type: Number},  
                                    OnGoingFanfics:         {type: Number},
                                    CompleteFanfics:        {type: Number},
                                    SavedFanfics:           {type: Number},
                                    DeletedFanfics:         {type: Number}
    },
    Images:                     {
                                    Image_Name_Main:            {type: String},
                                    Image_Name_Main_Still:      {type: String},
                                    Image_Name_Icon:            {type: String},                              
                                    Image_Name_Fanfic:          {type: String},                              
                                    Image_Name_Path:            {type: String},                              
    },
    LastUpdate:                 {type: Number},
    FanficsLastUpdate:          {type: Number},
    SavedFanficsLastUpdate:     {type: Number}
 });
 
 
 
 var Fandom = mongoose.dbFandoms.model('Fandom', FandomSchema);
 
 
 module.exports = Fandom;
