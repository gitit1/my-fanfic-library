const clc = require("cli-color");
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');
const { getFanfics } = require('../../helpers/getFanfics');
const { checkForUserDataInDBOnCurrentFanfics } = require('../../helpers/checkForUserDataInDBOnCurrentFanfics');

exports.getFilteredFanficsHandler = (userEmail, fandomName, filterObj, sortObj, pageLimit, pageNumber, sorted, shortIds) => {
    console.log(clc.bgGreenBright('[db controller] getFilteredFanficsHandler()'));
    return new Promise(async function (resolve, reject) {
        try {
            let skip = (pageLimit * pageNumber) - pageLimit;
            newFilterObj = sorted ? shortIds : filterObj;
            newFilterObj = { ...newFilterObj, 'FandomName': fandomName }
            const fandomData = await FandomModal.find({ 'FandomName': fandomName }, function (err, fandoms) { if (err) { throw err; } });
            const collectionName = (fandomData[0].Collection && fandomData[0].Collection !== '') ? fandomData[0].Collection : fandomName;
            getFanfics(skip, pageLimit, fandomName, newFilterObj, sortObj, null, null, sorted).then(async filteredFanfics => {
                let resultsCounter = await mongoose.dbFanfics.collection(collectionName).countDocuments({...filterObj, 'FandomName': fandomName});
                console.log('filterObj:', resultsCounter)
                console.log('resultsCounter:', resultsCounter)
                let userData = await checkForUserDataInDBOnCurrentFanfics(userEmail, filteredFanfics)
                resolve([filteredFanfics, userData, resultsCounter])
            }).catch(err => reject(err))
        } catch (error) {
            reject(error)
        }
    });
}