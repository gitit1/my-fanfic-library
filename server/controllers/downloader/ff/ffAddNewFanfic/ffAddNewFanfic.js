
let request = require('request')
let jar = request.jar();

request = request.defaults({
  jar: jar,
  followAllRedirects: true
});


const {getFixedUrl} = require('../helpers/getFixedUrl');
const {getDataFromPage} = require('../helpers/getDataFromPage');
const {checkForSimilar} = require('./functions/checkForSimilar')

exports.ffAddNewFanfic = async (url,fandomName) =>{ 
    const fixedUrl                  =   await getFixedUrl(url);
    const fanfic                    =   await getDataFromPage(fixedUrl,fandomName)
    const checkForSimilarResult     =   await checkForSimilar(fanfic,fandomName)

    if(!checkForSimilarResult){
        return([fanfic]) 
    }else{
        return([fanfic,checkForSimilarResult[0]])
    }

}