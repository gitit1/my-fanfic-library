const express = require('express');
const router = express.Router();


const db = require('../controllers/db/db');
const users = require('../controllers/users/users');
const downloader = require('../controllers/downloader/downloader');
const updates = require('../controllers/updates/updates');
// const otherfanficssites = require('../controllers/downloader/ff/otherfanficssites');


try {
  console.log('[Server] - in routes')

  router.post('/db/addEditFandom',db.addEditFandomToDB);
  router.post('/db/deleteFandom',db.deleteFandomFromDB);
  router.get('/db/getAllFandoms',db.getAllFandomsFromDB); 

  router.post('/db/getFanfics',db.getFanficsFromDB);
  router.post('/db/saveCategories',db.saveFanficCategoriesToDB);
  router.post('/db/getReadingList',db.getReadingListsFromDB);
  router.post('/db/saveReadingList',db.saveReadingListToDB);
  router.post('/db/getFilteredFanficsListFromDB',db.getFilteredFanficsListFromDB)
  router.post('/db/addFanficToUserMarks',db.addFanficToUserMarksInDB);
  router.post('/db/addFanficToUserStatus',db.addFanficToUserStatus);
  router.get('/db/getLastUpdateDate',db.getLastUpdateDate);
  
  router.post('/users/register',users.register);
  router.post('/users/login',users.login);
  
  router.get('/downloader/getFanficData',downloader.getNewFanfic)
  router.post('/downloader/getFanficData',downloader.getNewFanfic)
  router.post('/downloader/saveNewFanfic',downloader.saveNewFanfic)
  
  router.get('/updates/latestUpdates',updates.latestUpdates)
  router.get('/updates/myLatestActivities',updates.myLatestActivities)
  router.get('/updates/myFanficsUpdate',updates.myFanficsUpdate)
  // checking:
  // router.get('/ao3/checkIfFileExsistHandler',ao3.checkIfFileExsistHandler)
  // router.get('/otherfanficssites/testpath',otherfanficssites.testpath)
  // router.get('/otherfanficssites/downloadFanfic',otherfanficssites.downloadFanfic)
  // router.post('/db/getUserDataFromDB',db.checkForUserDataInDBOnCurrentFanfics);

  


} catch(e) {
  console.log(`ERROR!! \n${e.stack}`);
}

module.exports = router;