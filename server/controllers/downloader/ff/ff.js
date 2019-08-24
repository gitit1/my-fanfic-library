const ff = { 
    ...require('./ffGetFanfics/ffGetFanfics'),
    ...require('./ffAddNewFanfic/ffAddNewFanfic'),
    ...require('./ffSaveFanfic/ffSaveFanfic')
}

module.exports=ff;


