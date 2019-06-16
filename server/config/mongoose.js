const mongoose = require('mongoose');

require('dotenv').config({
    path: 'variables.env'
});

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true
  }, () => {
    console.log("DB is connected")
})

mongoose.Promise = global.Promise;
require('../models/Fandom');
require('../models/Fanfics');
require('../models/Fanfic');