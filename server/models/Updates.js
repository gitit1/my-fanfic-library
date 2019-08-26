const mongoose = require('../config/mongoose');
const Schema = mongoose.Schema;

const UpdatesSchema = new Schema({
    Date:       {type: Number, unique: true},
    Fandom:     [
                    {
                        FandomName:{type: String},
                        New:{type: Number},
                        Updated:{type: Number},
                        FanficsIds:[
                            {
                                FanficID:       {type: Number},
                                FanficTitle:    {type: String},
                                Author:         {type: String},
                                Source:         {type: String},
                                Status:         {type: String},      
                                StatusDetails:  {type: String}, 
                            }
                        ]
                    }

                ]    
 });

let Updates = mongoose.dbFandoms.model('Updates', UpdatesSchema);
 
 
 module.exports = Updates;

