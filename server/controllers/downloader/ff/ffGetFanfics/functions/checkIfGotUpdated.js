const {getDataFromPage} = require('../../helpers/getDataFromPage');
const {saveFanficToDB} = require('../../../helpers/saveFanficToDB');
const {downloadFanfic} = require('../../../helpers/downloadFanfic');
const func = require('../../../helpers/generalFunctions');

exports.checkIfGotUpdated = (autoSave,fanfic) =>{ 
    return func.delay(7000).then(()=>{
        return new Promise(function(resolve, reject) {        
            const oldData = fanfic;
            console.log('fanficName',fanfic.FanficTitle)
            getDataFromPage(fanfic.URL,fanfic.FandomName).then(async newData=>{
                const updated = (
                    (newData.NumberOfChapters > oldData.NumberOfChapters) ||
                    (newData.LastUpdateOfFic > oldData.LastUpdateOfFic) ||
                    (newData.FanficTitle !== oldData.FanficTitle) || 
                    (newData.Author !== oldData.Author))  ? true : false;
                if(updated){
                    newData.NeedToSaveFlag=true;
                    newData.Status = 'updated';
                    newData.StatusDetails = 
                        (newData.Complete !== oldData.Complete) ? 'completed' :
                        (newData.NumberOfChapters > oldData.NumberOfChapters) ? 'chapter' :
                        (newData.Author !== oldData.Author) ? 'author' :
                        (newData.FanficTitle !== oldData.FanficTitle) ? 'title' : 'old';
                }else{
                    newData.NeedToSaveFlag=false;
                    newData.Status = 'old';
                    newData.StatusDetails='old';
                }  
                newData.SavedFic=oldData.SavedFic;
                newData.fileName=oldData.fileName;
                newData.savedAs=oldData.savedAs;
        
                await saveFanficToDB(fanfic.FandomName,newData).then(async res=>{         
                    updated && autoSave && await downloadFanfic(newData.URL,newData.Source,newData.fileName,newData.savedAs,newData.FandomName,newData.FanficID);
                    !res ? reject() : (updated && autoSave) ? resolve(true) : resolve(false)               
                });
            })
        });
    })
}
