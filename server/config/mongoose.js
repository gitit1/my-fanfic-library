const mongoose = require('mongoose');
const dbUrl = require("./keys");

mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.dbFandoms = mongoose.createConnection(dbUrl.dbFandoms, {
    useNewUrlParser: true,
    poolSize: 10
  }, () => {
    console.log("myfanficslybrary_fandoms is connected")
})

mongoose.dbFanfics = mongoose.createConnection(dbUrl.dbFanfics, {
  useNewUrlParser: true,
  poolSize: 10
}, () => {
  console.log("myfanficslybrary_fanfics is connected")
})
mongoose.dbUsers = mongoose.createConnection(dbUrl.dbUsers, {
  useNewUrlParser: true,
  poolSize: 10
}, () => {
  console.log("myfanficslybrary_users is connected")
})


// mongoose.Promise = global.Promise;

module.exports = mongoose;

