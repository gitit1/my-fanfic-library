const {getDataFromPage} = require('./functions/getDataFromPage')
const funcs = require('../../helpers/index');

exports.ao3AddNewFanfic = async (jar,url,fandomName) =>{ 
    const fanfic                    =   await getDataFromPage(jar,url,fandomName);
    const checkForSimilarResult     =   await funcs.checkForSimilar(fanfic,fandomName);


    if(!checkForSimilarResult){
        return([fanfic]) 
    }else{
        return([fanfic,checkForSimilarResult[0]])
    }

}