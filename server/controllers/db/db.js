
const db = { 
    ...require('./CRUD/Fandoms/addEditFandomToDB'),
    ...require('./CRUD/Fandoms/deleteFandomFromDB'),
    ...require('./CRUD/Fandoms/getAllFandomsFromDB'),
    ...require('./CRUD/Fanfics/getFanficsFromDB'),
    ...require('./CRUD/Fanfics/deleteFanficFromDB.js'),
    ...require('./CRUD/Fanfics/saveImageOfFanficToDB.js'),
    ...require('./CRUD/Fanfics/Categories/saveFanficCategoriesToDB'),
    ...require('./Filters/getFilteredFanficsListFromDB'),
    ...require('./UserData/addFanficToUserMarksInDB'),
    ...require('./UserData/addFanficToUserStatus'),
    ...require('./UserData/getLastUpdateDate'),
    ...require('./UserData/saveReadingListToDB'),
    ...require('./UserData/getReadingListsFromDB'),
    ...require('./UserData/addFandomToUserFavorites'),
    ...require('./UserData/getUserFandomsFromDB'),
    ...require('./UserData/getFullUserDataFromDB'),
}

module.exports=db;
