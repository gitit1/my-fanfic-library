const express = require('express');
const ao3 = require('../controllers/ao3/ao3');

const router = express.Router();

/* API */
try {
  router.get('/ao3/connect', ao3.connectToAo3);

} catch(e) {
  console.log(`ERROR!! \n${e.stack}`);
}

module.exports = router;