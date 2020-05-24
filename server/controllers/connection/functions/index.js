const funcs = { 
    ...require('./getFandomFanfics.js'),
    ...require('./getDeletedFanfics.js'),
    ...require('./updateFandomNumbers.js'),
}

module.exports=funcs;