const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const multiparty = require('multiparty');

const app = express();
const data = new multiparty.Form();

const port = 5000;

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/',routes);



app.listen(port, () => console.log(`Listening on port ${port}`));