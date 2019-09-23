const manually = { 
    ...require('./addNewFanfic/addNewFanfic'),
    ...require('./saveNewFanfic/saveNewFanfic'),
    ...require('./updateExistFanfic/updateExistFanfic'),
}

module.exports=manually;


