const fileReader = { 
    ...require('./epub/getEpub'),
    ...require('./epub/readEpub'),
    ...require('./pdf/getPdf'),
    ...require('./helpers/saveNewFanfic')
}

module.exports=fileReader;


