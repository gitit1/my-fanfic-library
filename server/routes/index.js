const express = require('express');
const router = express.Router();

const db = require('../controllers/db');
const ao3 = require('../controllers/ao3');
const users = require('../controllers/users');


try {
  console.log('[Server] - in routes')
  router.post('/db/addEditFandom',db.addEditFandomToDB);
  router.post('/db/deleteFandom',db.deleteFandomFromDB);
  router.get('/db/getAllFandoms',db.getAllFandomsFromDB);   
  router.get('/db/getFanfics',db.getFanficsFromDB);

  router.get('/ao3/connectToAO3',ao3.connectToAO3)


  router.post('/users/register',users.register);
  router.post('/users/login',users.login);

} catch(e) {
  console.log(`ERROR!! \n${e.stack}`);
}

module.exports = router;