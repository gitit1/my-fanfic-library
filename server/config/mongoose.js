const mongoose = require('mongoose');

require('dotenv').config({
    path: 'variables.env'
});

mongoose.set('useCreateIndex', true);
mongoose.dbFandoms = mongoose.createConnection(process.env.DATABASEFANDOMS, {
    useNewUrlParser: true
  }, () => {
    console.log("myfanficslybrary_fandoms is connected")
})

mongoose.dbFanfics = mongoose.createConnection(process.env.DATABASEFANFICS, {
  useNewUrlParser: true
}, () => {
  console.log("myfanficslybrary_fanfics is connected")
})

mongoose.Promise = global.Promise;

module.exports = mongoose;

