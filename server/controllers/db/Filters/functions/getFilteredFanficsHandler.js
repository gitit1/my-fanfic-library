const clc = require("cli-color");
const mongoose = require('../../../../config/mongoose');

const {getFanfics} = require('../../helpers/getFanfics');
const {checkForUserDataInDBOnCurrentFanfics} = require('../../helpers/checkForUserDataInDBOnCurrentFanfics');

exports.getFilteredFanficsHandler = (userEmail,fandomName,filterObj,sortObj,pageLimit,pageNumber,sorted) =>{
    console.log(clc.bgGreenBright('[db controller] getFilteredFanficsHandler()')); 
    return new Promise(function(resolve, reject) {
        try {           
            let skip = (pageLimit*pageNumber)-pageLimit;
            getFanfics(skip,pageLimit,fandomName,filterObj,sortObj,null,null,sorted).then(async filteredFanfics=>{
                let resultsCounter = await mongoose.dbFanfics.collection(fandomName).countDocuments(filterObj);
                console.log('filterObj:',resultsCounter)
                console.log('resultsCounter:',resultsCounter)
                let userData = await checkForUserDataInDBOnCurrentFanfics(userEmail,filteredFanfics)
                resolve([filteredFanfics,userData,resultsCounter])
            }).catch(err=>reject(err))    
        } catch (error) {
            reject(error) 
        }
    });
}