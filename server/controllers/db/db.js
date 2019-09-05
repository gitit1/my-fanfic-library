
const db = { 
    ...require('./CRUD/Fandoms/addEditFandomToDB'),
    ...require('./CRUD/Fandoms/deleteFandomFromDB'),
    ...require('./CRUD/Fandoms/getAllFandomsFromDB'),
    ...require('./CRUD/Fanfics/getFanficsFromDB'),
    ...require('./CRUD/Fanfics/Categories/saveFanficCategoriesToDB'),
    ...require('./Filters/getFilteredFanficsListFromDB'),
    ...require('./UserData/addFanficToUserMarksInDB'),
    ...require('./UserData/addFanficToUserStatus'),
    ...require('./UserData/getLastUpdateDate'),
    ...require('./UserData/saveReadingListToDB'),
    ...require('./UserData/getReadingListsFromDB'),
}

module.exports=db;
