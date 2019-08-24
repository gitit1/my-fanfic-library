const clc = require("cli-color");
const FandomUserData = require('../../../../models/UserData');

const {getFilteredFanficsHandler} = require('./getFilteredFanficsHandler')

exports.userDataFiltersHandler = (userEmail,fandomName,filtersArrays,sortObj,pageLimit,pageNumber) =>{
    console.log(clc.bgGreenBright('[db controller] userDataFiltersHandler()')); 
    return new Promise(function(resolve, reject) {
        try {
            //USER DATA FILTERS:
            let idsList=[]
            const filterObj = Object.assign({'userEmail': userEmail},{'FanficList.FandomName':fandomName},{'FanficList.FanficID': { $nin: filtersArrays[3] }}, ...filtersArrays[0]);
            console.log('----filterObj:',filterObj)
            // FandomUserData.find({'userEmail': userEmail}, async function(err, data) {
            FandomUserData.aggregate([{$unwind:"$FanficList"},{$match:filterObj},
                                    {$group :  {_id : {FandomName: "$FanficList.FandomName", FanficID: "$FanficList.FanficID"}} },
                                    {$project: { _id: 0,FandomName:'$_id.FandomName',FanficID:'$_id.FanficID'}}
                                    ], async function(err, filtered) {
                                        pageLimit = Number(pageLimit), pageNumber = Number(pageNumber)
                                        filtered.map(fanfic => idsList.push(fanfic.FanficID));
                                        // let initSkip = (pageLimit*pageNumber)-pageLimit;
                                        
                                        const filterObj = Object.assign({FanficID: {$in: idsList}}, ...filtersArrays[1]);

                                        let filteredData = await getFilteredFanficsHandler(userEmail,fandomName,filterObj,sortObj,pageLimit,pageNumber)
                                        resolve(filteredData)
            })       
        } catch (error) {
            reject(error) 
        }
    });

}