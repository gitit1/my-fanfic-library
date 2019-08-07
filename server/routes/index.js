const express = require('express');
const router = express.Router();

const buildDir  = require('path').join(__dirname,'../build');

const db = require('../controllers/db');
const ao3 = require('../controllers/ao3');
const otherfanficssites = require('../controllers/otherfanficssites');
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
  router.get('/db/getLastUpdateDate',db.getLastUpdateDate);
  
  
  router.post('/users/register',users.register);
  router.post('/users/login',users.login);
  
  router.get('/otherfanficssites/getFanficData',otherfanficssites.getFanficData)
  router.post('/otherfanficssites/saveDataOfFanficToDB',otherfanficssites.saveDataOfFanficToDB)
  
  // checking:
  router.get('/ao3/checkIfFileExsistHandler',ao3.checkIfFileExsistHandler)
  // router.get('/otherfanficssites/downloadFanfic',otherfanficssites.downloadFanfic)
  // router.post('/db/getUserDataFromDB',db.checkForUserDataInDBOnCurrentFanfics);

  
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