const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  level: {
    type:  Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

let User = mongoose.dbUsers.model('User', UserSchema);

 
module.exports = User;