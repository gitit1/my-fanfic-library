const ao3 = { 
    ...require('./ao3GetFanfics/ao3GetFanfics'),
    ...require('./ao3GetDeletedFanfics/ao3GetDeletedFanfics'),
    ...require('./ao3SaveMissingFanfics/ao3SaveMissingFanfics'),
    ...require('./ao3AddNewFanfic/ao3AddNewFanfic'),
    ...require('./ao3SaveFanfic/ao3SaveFanfic')
}

module.exports=ao3;


