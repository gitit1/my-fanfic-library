const clc = require("cli-color");
const FandomUserData = require('../../../../models/UserData');

const {getFilteredFanficsHandler} = require('./getFilteredFanficsHandler')

exports.userDataFiltersHandler = (userEmail,fandomName,filtersArrays,sortObj,pageLimit,pageNumber) =>{
    console.log(clc.bgGreenBright('[db controller] userDataFiltersHandler()')); 
    return new Promise(function(resolve, reject) {
        try {
            //USER DATA FILTERS:
            let idsList=[],ordered = [];
            const filterObj = Object.assign({'userEmail': userEmail},{'FanficList.FandomName':fandomName},{'FanficList.FanficID': { $nin: filtersArrays[3] }}, ...filtersArrays[0]);
            FandomUserData.aggregate([{$unwind:"$FanficList"},{$match:filterObj},
                                    {$group :  {_id : {FandomName: "$FanficList.FandomName", FanficID: "$FanficList.FanficID", Date:'$FanficList.Date'}} },
                                    {$project: { _id: 0,FandomName:'$_id.FandomName',FanficID:'$_id.FanficID', Date:'$_id.Date'}},        
                                    ], async function(err, filtered) {
                                        pageLimit = Number(pageLimit), pageNumber = Number(pageNumber);
                                        filtered.sort( function ( a, b ) { return b.Date - a.Date; } ).map(fanfic => idsList.push(fanfic.FanficID));
                                        shortIds =  filtersArrays[4] ? 
                                                    Object.assign({FanficID: {$in: idsList.slice(pageNumber-1, (pageLimit*pageNumber)-1)}}, ...filtersArrays[1]) : null;
                                        const filterObj =  Object.assign({FanficID: {$in: idsList}}, ...filtersArrays[1]);
                                        let filteredData = await getFilteredFanficsHandler(userEmail,fandomName,filterObj,sortObj,pageLimit,pageNumber,filtersArrays[4],shortIds);
                                        if(filtersArrays[4]){                                            
                                            await idsList.map(id => {return filteredData[0].filter(fanfic => {if(id === fanfic.FanficID){ ordered.push(fanfic);}});});
                                            filteredData[0] = ordered;
                                        }
                                        resolve(filteredData)

                                    })       
        } catch (error) {
            reject(error) 
        }
    });

}