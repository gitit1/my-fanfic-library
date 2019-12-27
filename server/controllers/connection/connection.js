
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
                let p = Promise.resolve();
                switch (choice) {
                    case 'getFandomFanficsPartial':
                        console.log('---  not stand by part')
                        await fetchedFandoms.map(async fandom => promises.push(
                            await new Promise(resolve => setTimeout(resolve, 30000)),
                            p = p.then(() => funcs.getFandomFanfics(socket,fandom,'partial') )                             
                        ))
                        break;  
                    case 'getFandomFanficsFull':
                            console.log('---  not stand by full')
                            await fetchedFandoms.map(async fandom => promises.push(
                                await new Promise(resolve => setTimeout(resolve, 30000)),
                                p = p.then(() => funcs.getFandomFanfics(socket,fandom,'full') )                             
                            ))
                            break;                                        
                    case 'getDeletedFanfics':
                        await fetchedFandoms.map(async fandom => promises.push(
                            await new Promise(resolve => setTimeout(resolve, 30000)),
                            p = p.then(() => funcs.getDeletedFanfics(socket,fandom) )                                                          
                        ))
                        break;
                    case 'saveFanfics':
                        await fetchedFandoms.map(fandom => promises.push(
                            p = p.then(() => funcs.downloadFanficsToServerHandler(socket,fandom,method) )                                                                                                                   
                        ))
                        break;
                    case 'checkIfFileExsists':
                            await fetchedFandoms.map(fandom => promises.push(
                                p = p.then(() => funcs.saveMissingFanfics(socket,fandom,method) )                                                                                                                 
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
                case 'getFandomFanficsPartial':
                    console.log('--- stand by part')
                    await funcs.getFandomFanfics(socket,fandom,'partial')
                    break; 
                case 'getFandomFanficsFull':
                        console.log('--- stand by full')
                    await funcs.getFandomFanfics(socket,fandom,'full')
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
            }
            
        }

        return null
    } catch(e) {
        console.log(e);
    }
}
