const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const passport = require("passport");

const publicDir = require('path').join(__dirname,'/public');
const ao3Connect = require('./controllers/ao3')
const users = require("./controllers/users");
// require('dotenv').config({
//     path: 'variables.env'
// });

require('./config/mongoose.js')
require('./controllers/socket/socket');
//TODO: check the cronjob scuduale
require('./cronJobs/cron')

//ADD CRONJOB TO LOGIN EVERY WEEK
//TODO: check if already connected
//ao3Connect.connectToAO3()

const app = express();

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);


// const port = process.env.PORT || 5000;
const port = 5000;



app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.use('/',routes);



app.listen(port, () => console.log(`Listening on port ${port}`));