const express = require('express');
const router = express.Router();

const buildDir  = require('path').join(__dirname,'../build');

const db = require('../controllers/db');
const ao3 = require('../controllers/ao3');
const users = require('../controllers/users');


try {
  console.log('[Server] - in routes')

  router.post('/db/addEditFandom',db.addEditFandomToDB);
  router.post('/db/deleteFandom',db.deleteFandomFromDB);
  router.get('/db/getAllFandoms',db.getAllFandomsFromDB); 

  router.post('/db/getFanfics',db.getFanficsFromDB);
  router.post('/db/getFilteredFanficsListFromDB',db.getFilteredFanficsListFromDB)
  router.post('/db/addFanficToUserMarks',db.addFanficToUserMarksInDB);
  router.post('/db/addFanficToUserStatus',db.addFanficToUserStatus);
  // router.post('/db/getUserDataFromDB',db.checkForUserDataInDBOnCurrentFanfics);
 
  
  router.post('/users/register',users.register);
  router.post('/users/login',users.login);

  // checking:
  router.get('/ao3/checkIfFileExsistHandler',ao3.checkIfFileExsistHandler)
  router.get('/db/getLastUpdateDate',db.getLastUpdateDate)
  
  //if (!keys.nodeEnv==='development'){  
  //  router.get('/',function(req,res){
  //    res.sendFile(path.join(buildDir+'/index.html'));
      //__dirname : It will resolve to your project folder.
  //  });
  //}

} catch(e) {
  console.log(`ERROR!! \n${e.stack}`);
}

module.exports = router;