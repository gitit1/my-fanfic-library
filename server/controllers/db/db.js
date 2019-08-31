
const db = { 
    ...require('./CRUD/addEditFandomToDB'),
    ...require('./CRUD/deleteFandomFromDB'),
    ...require('./CRUD/getAllFandomsFromDB'),
    ...require('./CRUD/getFanficsFromDB'),
    ...require('./CRUD/saveFanficCategoriesToDB'),
    ...require('./Filters/getFilteredFanficsListFromDB'),
    ...require('./UserData/addFanficToUserMarksInDB'),
    ...require('./UserData/addFanficToUserStatus'),
    ...require('./UserData/getLastUpdateDate'),
}

module.exports=db;
