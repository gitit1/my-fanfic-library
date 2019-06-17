const express = require('express');
const router = express.Router();

const connection = require('../controllers/connection');
const ao3 = require('../controllers/ao3/ao3');
const db = require('../controllers/db/db');


try {
  console.log('[Server] - in routes')
  router.post('/db/addEditFandom',db.addEditFandomToDB);
  router.post('/db/deleteFandom',db.deleteFandomFromDB);
  


  /*-----------------------------------------*/
  router.get('/db/getFanfics',db.getFanficsFromDB);
  router.get('/ao3/connect', ao3.connectToAo3);
  router.get('/db/getAllFandoms',db.getAllFandomsFromDB);  
  router.get('/db/getFanficsFromAo3',db.getFanficsFromAo3);

} catch(e) {
  console.log(`ERROR!! \n${e.stack}`);
}

module.exports = router;