const funcs = { 
    ...require('../../helpers/loginToAO3'),
    ...require('../../helpers/getUrlBodyFromAo3.js'),
    ...require('./getPagesOfFandomData.js'),
    ...require('./getDataFromAO3FandomPage.js'),
    ...require('./createAO3Url.js')

}

module.exports=funcs;