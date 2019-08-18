const funcs = { 
    ...require('./getFandomFanfics.js'),
    ...require('./getDeletedFanfics.js'),
    ...require('./saveFanfics.js'), 
    ...require('./saveMissingFanfics.js') 
}

module.exports=funcs;