const clc = require("cli-color");

const {getFiltersRules} = require('./functions/getFiltersRules')
const {userDataFiltersHandler} = require('./functions/userDataFiltersHandler')
const {getFilteredFanficsHandler} = require('./functions/getFilteredFanficsHandler')



exports.getFilteredFanficsListFromDB = async (req,res)=>{
    console.log(clc.blue('[db controller] getFanficsFromDB()'));
    let {fandomName,userEmail,pageLimit,pageNumber} = req.query, filters = req.body,filtersArrays=[],flag;

    filtersArrays = await getFiltersRules(filters,userEmail)//[0] - userData filters , [1] - fanfics filters, [2] - sort 
    sortObj = Object.assign({}, ...filtersArrays[2]);
    if(filtersArrays[2].length!==0 && filtersArrays[0].length===0 && filtersArrays[1].length===0){
        let filteredFanficsData = await getFilteredFanficsHandler(userEmail,fandomName,{},sortObj,pageLimit,pageNumber)
        res.send([filteredFanficsData[0],filteredFanficsData[1],filteredFanficsData[2]])
    }else if(filtersArrays[0].length!==0){
        let filteredData = await userDataFiltersHandler(userEmail,fandomName,filtersArrays,sortObj,pageLimit,pageNumber);
        res.send([filteredData[0],filteredData[1],filteredData[2]])
    }else if(filtersArrays[1].length!==0){
        const filterObj = Object.assign({}, ...filtersArrays[1]);
        let filteredFanficsData = await getFilteredFanficsHandler(userEmail,fandomName,filterObj,sortObj,pageLimit,pageNumber)
        res.send([filteredFanficsData[0],filteredFanficsData[1],filteredFanficsData[2]])
    }
}





