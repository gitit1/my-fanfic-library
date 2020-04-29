const fileReader = { 
    ...require('./epub/getEpub'),
    ...require('./epub/readEpub'),
    ...require('./helpers/saveNewFanfic')
}

module.exports=fileReader;


