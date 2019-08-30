const {checkForSimilar} = require('../../helpers/checkForSimilar');
const {createFanficObj} = require('../helpers/createFanficObj');

exports.addNewFanfic = async (fandomName,fanficData) =>{
    const fanfic = await createFanficObj(fandomName,fanficData);
    const checkForSimilarResult     =   await checkForSimilar(fanfic,fandomName)

    if(!checkForSimilarResult){
        return([fanfic]) 
    }else{
        return([fanfic,checkForSimilarResult[0]])
    }
}
