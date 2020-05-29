const manually = { 
    ...require('./addNewFanfic/addNewFanfic'),
    ...require('./saveNewFanfic/saveNewFanfic'),
    ...require('./updateExistFanfic/updateExistFanfic'),
    ...require('./handleDuplicateTitles/saveAsSimilarFanfic'),
}

module.exports=manually;


