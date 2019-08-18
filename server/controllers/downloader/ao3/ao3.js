const ao3 = { 
    ...require('./ao3GetFanfics/ao3GetFanfics.js'),
    ...require('./ao3GetDeletedFanfics/ao3GetDeletedFanfics.js'),
    ...require('./ao3SaveMissingFanfics/ao3SaveMissingFanfics.js'),
}

module.exports=ao3;


