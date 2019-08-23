export {
    getFandomsFromDB,
    editFandomDataStart,
    addFandomToDB,
    deleteFandomFromDB,
    getFandom,
    getLastUpdateDate
} from './fandoms';

export {
    getFanficsFromDB,
    addFanficToUserMarks,
    addFanficToUserStatus,
    getFilteredFanficsFromDB
} from './fanfics';

export {
    getLatestUpdates
} from './updates';

export {
    registerUser,
    loginUser,
    setCurrentUser,
    logoutUser
} from './users';

export{
    getDataOfFanfic,
    saveDataOfFanficToDB
}from './downloader'

export{
    saveScreenSize
}from './screenSize'