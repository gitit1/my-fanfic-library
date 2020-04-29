const fileReader = { 
    ...require('./functions/checkForSimilar'),
    ...require('./functions/downloadFanfic'),
    ...require('./functions/generalFunctions'),
    ...require('./functions/saveFanficToDB'),
    ...require('./functions/fsCommands'),
    ...require('./functions/createFanficObj'),
    ...require('./functions/updateFandomDataInDB')
}

module.exports=fileReader;


