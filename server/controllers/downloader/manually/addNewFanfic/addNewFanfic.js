const funcs = require('../../helpers/index');

exports.addNewFanfic = async (fandomName, fanficData) => {
    const fanfic = await funcs.createFanficObj(fandomName, fanficData);
    const checkForSimilarResult = await funcs.checkForSimilar(fanfic, fandomName)

    if (!checkForSimilarResult) {
        return ([fanfic])
    } else {
        return ([fanfic, checkForSimilarResult[0]])
    }
}
