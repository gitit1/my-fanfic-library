
const clc = require("cli-color");
const db  =  require('../db/db')
const funcs = require('./functions/index')

exports.manageDownloader = async (socket,fandom,choice,method) =>{
    console.log(clc.blue('[connection] manageDownloader'));
    try {
        if(fandom=='All'){
            let fetchedFandoms = await db.getAllFandoms().then(fetchedFandoms=>{
                if(!fetchedFandoms){
                    return false
                }else{
                    return fetchedFandoms
                }
            })
            let promises = [];
            if(fetchedFandoms){
                // fetchedAllFandomsHandler
                let p = Promise.resolve();
                switch (choice) {
                    case 'getFandomFanfics':
                        await fetchedFandoms.map(fandom => promises.push(
                            // p = p.then(() => funcs.getFandomFanfics(socket,fandom,method) )                               
                            p = p.then(() => funcs.getFandomFanfics(socket,fandom) )                               
                        ))
                        break;                
                    case 'getDeletedFanfics':
                        await fetchedFandoms.map(fandom => promises.push(
                            p = p.then(() => funcs.getDeletedFanfics(socket,fandom) )                                                          
                        ))
                        break;
                    case 'saveFanfics':
                        await fetchedFandoms.map(fandom => promises.push(
                            // p = p.then(() => funcs.downloadFanficsToServerHandler(socket,fandom,method) )                                                          
                            p = p.then(() => funcs.downloadFanficsToServerHandler(socket,fandom) )                                                          
                        ))
                        break;
                    case 'checkIfFileExsists':
                            await fetchedFandoms.map(fandom => promises.push(
                                // p = p.then(() => funcs.saveMissingFanfics(socket,fandom,method) )                                                          
                                p = p.then(() => funcs.saveMissingFanfics(socket,fandom) )                                                          
                            ))
                            break;                        
                    case 'All':
                        await fetchedFandoms.map(fandom => promises.push(
                            // p = p.then(() => funcs.getFandomFanfics(socket,fandom,method) ),  
                            p = p.then(() => funcs.getFandomFanfics(socket,fandom) ),  
                            p = p.then(() => funcs.getDeletedFanfics(socket,fandom) )                                                     
                        ))
                        break;
                }
   
                return null;

            }else{
                console.log(clc.cyanBright(`Server got error in manageDownloader`));
                socket && socket.emit('getFanficsData', `<span style="color:red"><b>Server got error in manageDownloader</b></span>`);   
                return null;             
            }


        }else{
            switch (choice) {
                case 'getFandomFanfics':
                    // await funcs.getFandomFanfics(socket,fandom,method)
                    await funcs.getFandomFanfics(socket,fandom)
                    break;                
                case 'getDeletedFanfics':
                    await funcs.getDeletedFanfics(socket,fandom)
                    break;
                case 'saveFanfics':
                    await funcs.saveFanfics(socket,fandom,method)
                    break;
                case 'checkIfFileExsists':
                    await funcs.saveMissingFanfics(socket,fandom)
                    break;
                case 'All':
                    // await funcs.getFandomFanfics(socket,fandom,method)
                    await funcs.getFandomFanfics(socket,fandom)
                    break;
            }
            
        }

        return null
    } catch(e) {
        console.log(e);
    }
}
