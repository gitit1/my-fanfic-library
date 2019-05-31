const express = require('express');
const router = express.Router();

const ao3 = require('../controllers/ao3/ao3');
const db = require('../controllers/db/db');

try {
  router.get('/ao3/connect', ao3.connectToAo3);
  router.get('/db/addFandom',db.addFandomToDB);
  router.get('/db/getAllFandoms',db.getAllFandomsFromDB);

} catch(e) {
  console.log(`ERROR!! \n${e.stack}`);
}

module.exports = router;