
let request = require('request')
let jar = request.jar();

request = request.defaults({
  jar: jar,
  followAllRedirects: true
});


const {getDataFromPage} = require('./functions/getDataFromPage')
const {checkForSimilar} = require('../../helpers/checkForSimilar')

exports.ao3AddNewFanfic = async (url,fandomName) =>{ 

    const fanfic                    =   await getDataFromPage(url,fandomName);
    const checkForSimilarResult     =   await checkForSimilar(fanfic,fandomName);


    if(!checkForSimilarResult){
        return([fanfic]) 
    }else{
        return([fanfic,checkForSimilarResult[0]])
    }

}