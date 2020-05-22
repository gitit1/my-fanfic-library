const ff = { 
    ...require('./ffGetFanfics/ffGetFanfics'),
    ...require('./ffAddNewFanfic/ffAddNewFanfic'),
    ...require('./ffSaveFanfic/ffSaveFanfic'),
    ...require('./ffGetFanficsAndMergeWithAo3/ffGetFanficsAndMergeWithAo3')
}

module.exports=ff;


