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
  router.post('/db/addFanficToUserFavorites',db.addFanficToUserFavoritesInDB);
  // router.post('/db/getUserDataFromDB',db.checkForUserDataInDBOnCurrentFanfics);


  
  
  router.post('/users/register',users.register);
  router.post('/users/login',users.login);

  //TODO: funcs in testing:
  router.get('/ao3/checkIfDeletedFromAO3',ao3.checkIfDeletedFromAO3)
} catch(e) {
  console.log(`ERROR!! \n${e.stack}`);
}

module.exports = router;