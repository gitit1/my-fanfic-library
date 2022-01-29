const db = {
    //CRUD -  Fandoms
    ...require('./CRUD/Fandoms/addEditFandomToDB'),
    ...require('./CRUD/Fandoms/deleteFandomFromDB'),
    ...require('./CRUD/Fandoms/getAllFandomsFromDB'),
    //CRUD -  Fanfics
    ...require('./CRUD/Fanfics/getFanficsFromDB'),
    ...require('./CRUD/Fanfics/deleteFanficFromDB.js'),
    ...require('./CRUD/Fanfics/saveImageOfFanficToDB.js'),
    ...require('./CRUD/Fanfics/Categories/saveFanficCategoriesToDB'),
    //Filters
    ...require('./Filters/getFilteredFanficsListFromDB'),
    //ReadingList
    ...require('./UserData/ReadingList/deleteFanficFromReadingList'),
    ...require('./UserData/ReadingList/deleteReadingList'),
    ...require('./UserData/ReadingList/getReadingListsFromDB'),
    ...require('./UserData/ReadingList/saveReadingListToDB'),
    ...require('./UserData/ReadingList/saveImageOfReadingList'),
    //Mark&Status
    ...require('./UserData/Mark&Status/addFanficToUserMarksInDB'),
    ...require('./UserData/Mark&Status/addFanficToUserStatus'),
    //Other
    ...require('./UserData/getLastUpdateDate'),
    ...require('./UserData/addFandomToUserFavorites'),
    ...require('./UserData/getUserFandomsFromDB'),
    ...require('./UserData/getFullUserDataFromDB'),
    ...require('./Backup/backupDB'),
}

module.exports=db;
