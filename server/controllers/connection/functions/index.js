const funcs = { 
    ...require('./getFandomFanfics.js'),
    ...require('./getDeletedFanfics.js'),
    ...require('./updateFandomNumbers.js'),
    ...require('./handleDuplicateTitles.js')
}

module.exports=funcs;