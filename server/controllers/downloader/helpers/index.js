const fileReader = { 
    ...require('./functions/checkForSimilar'),
    ...require('./functions/downloadFanfic'),
    ...require('./functions/downloadFFfanfic'),
    ...require('./functions/downloadFFFanficNew'),
    ...require('./functions/generalFunctions'),
    ...require('./functions/saveFanficToDB'),
    ...require('./functions/fsCommands'),
    ...require('./functions/createFanficObj'),
    ...require('./functions/updateFandomDataInDB'),
    ...require('./functions/downloadImageFromLink'),
    ...require('./functions/updateFandomFanficsNumbers'),
    ...require('./functions/getFanficByID')
}

module.exports=fileReader;


