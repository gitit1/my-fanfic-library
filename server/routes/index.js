const express = require('express');
const router = express.Router();

const db = require('../controllers/db');


try {
  console.log('[Server] - in routes')
  router.post('/db/addEditFandom',db.addEditFandomToDB);
  router.post('/db/deleteFandom',db.deleteFandomFromDB);
  router.get('/db/getAllFandoms',db.getAllFandomsFromDB);   
  router.get('/db/getFanfics',db.getFanficsFromDB);


} catch(e) {
  console.log(`ERROR!! \n${e.stack}`);
}

module.exports = router;