const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const publicDir = require('path').join(__dirname,'/public');
const ao3Connect = require('./controllers/ao3')

require('dotenv').config({
    path: 'variables.env'
});

require('./config/mongoose.js')
require('./controllers/socket/socket');
require('./cronJobs/cron')

//ADD CRONJOB TO LOGIN EVERY WEEK
ao3Connect.connectToAO3()

const app = express();


const port = 5000;



app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.use('/',routes);



app.listen(port, () => console.log(`Listening on port ${port}`));