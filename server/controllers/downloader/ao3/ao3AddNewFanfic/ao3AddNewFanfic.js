const {getDataFromPage} = require('./functions/getDataFromPage')
const {checkForSimilar} = require('../../helpers/checkForSimilar')

exports.ao3AddNewFanfic = async (jar,url,fandomName) =>{ 
    const fanfic                    =   await getDataFromPage(jar,url,fandomName);
    const checkForSimilarResult     =   await checkForSimilar(fanfic,fandomName);


    if(!checkForSimilarResult){
        return([fanfic]) 
    }else{
        return([fanfic,checkForSimilarResult[0]])
    }

}