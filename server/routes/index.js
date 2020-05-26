const express = require('express');
const router = express.Router();


const db = require('../controllers/db/db');
const users = require('../controllers/users/users');
const downloader = require('../controllers/downloader/downloader');
const updates = require('../controllers/updates/updates');
const Other = require('../controllers/Other/other');
// const otherfanficssites = require('../controllers/downloader/ff/otherfanficssites');


try {
  console.log('[Server] - in routes')

  router.post('/contactUs',Other.contactUs);

  //DB - CRUD -  Fandoms
  router.post('/db/addEditFandom',db.addEditFandomToDB);
  router.post('/db/deleteFandom',db.deleteFandomFromDB);
  router.get('/db/getAllFandoms',db.getAllFandomsFromDB); 
  //DB - CRUD -  Fanfics
  router.post('/db/getFanfics',db.getFanficsFromDB);
  router.post('/db/deleteFanfic',db.deleteFanficFromDB);
  router.post('/db/saveImageOfFanfic',db.saveImageOfFanficToDB);
  router.post('/db/saveCategories',db.saveFanficCategoriesToDB);
  //DB - Filters
  router.post('/db/getFilteredFanficsListFromDB',db.getFilteredFanficsListFromDB)
  //DB - ReadingList
  router.post('/db/getReadingList',db.getReadingListsFromDB);
  router.post('/db/saveReadingList',db.saveReadingListToDB);
  router.post('/db/deleteFanficFromReadingList',db.deleteFanficFromReadingList);
  router.post('/db/deleteReadingList',db.deleteReadingList);
  router.post('/db/saveImageOfReadingList',db.saveImageOfReadingList);
  //DB - Mark&Status
  router.post('/db/addFanficToUserMarks',db.addFanficToUserMarksInDB);
  router.post('/db/addFanficToUserStatus',db.addFanficToUserStatus);
  //DB - Other
  router.get('/db/getLastUpdateDate',db.getLastUpdateDate);
  router.post('/db/addFandomToUserFavorites',db.addFandomToUserFavorites);
  router.post('/db/getUserFandoms',db.getUserFandomsFromDB);
  router.post('/db/getFullUserData',db.getFullUserDataFromDB);
  //Backup
  router.get('/db/backupDB',db.backupDB);
  
  //User
  router.post('/users/register',users.register);
  router.post('/users/login',users.login);
  
  //Downloader
  router.get('/downloader/getFanficData',downloader.getNewFanfic)
  router.post('/downloader/getFanficData',downloader.getNewFanfic)
  router.post('/downloader/getFanficDataFromFile',downloader.getFanficDataFromFile)
  router.post('/downloader/saveFanficFromFile',downloader.saveFanficFromFile)
  router.post('/downloader/saveNewFanfic',downloader.saveNewFanfic)
  router.post('/downloader/updateExistFanfic',downloader.updateExistFanfic)

  router.get('/downloader/wattpad',downloader.wpd)
  
  //Updates
  router.get('/updates/latestUpdates',updates.latestUpdates)
  router.get('/updates/myLatestActivities',updates.myLatestActivities)
  router.get('/updates/myFanficsUpdate',updates.myFanficsUpdate)
  
  router.get('/gitit/testingArea',downloader.testingArea)
  
} catch(e) {
  console.log(`ERROR!! \n${e.stack}`);
}

module.exports = router;