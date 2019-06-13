const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const io = require('./controllers/socket/socket');
//const cron = require('./cronJobs/cron')
const publicDir = require('path').join(__dirname,'/public');


const app = express();


const port = 5000;


app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(publicDir));
app.use('/',routes);



app.listen(port, () => console.log(`Listening on port ${port}`));