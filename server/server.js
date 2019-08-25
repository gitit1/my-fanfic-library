const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const passport = require("passport");


const publicDir = require('path').join(__dirname,'/public');
const buildDir  = require('path').join(__dirname,'/build');
require('./config/mongoose.js')
require('./controllers/connection/socket/socket');

const app = express();
const keys = require("./config/keys");

app.use(express.static(publicDir));
app.use(express.static(buildDir));
app.use(express.static(__dirname));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);


// const port = process.env.PORT || 5000;
const port = 5555;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/',routes);


//app.listen(port, () => console.log(`Listening on port ${port}`));

if (keys.nodeEnv==='development'){  
     app.listen(port, () => console.log(`Listening on port ${port} - development mode`));
 }else{
	 require('./cronJobs/cron');
	 app.get('*', function(req, res) {
		 res.sendFile(require('path').join(buildDir,'/index.html'));
	 });
	 app.listen(port, () => console.log(`Listening on port ${port} - production mode`));
 }
//server.listen(port, () => console.log(`Listening on port ${port} - development mode`));