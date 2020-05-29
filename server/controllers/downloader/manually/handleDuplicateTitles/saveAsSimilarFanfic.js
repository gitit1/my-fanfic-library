
const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');


exports.saveAsSimilarFanfic = async (similar, fandomName, id1, id2) =>{ 
    return await new Promise(async function(resolve, reject) {  
        console.log('[Manually] - saveAsSimilarFanfic');
        //console.log('similar, fandomName, id1, id2',similar, fandomName, id1, id2);
        if(similar){
            resolve(true)
        } else {
            resolve(true)
        }

    });
}