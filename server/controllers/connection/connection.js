
const clc = require("cli-color");
const funcs = require('./functions/index')
const logger = require('simple-node-logger');
const {fetchFandoms}  =  require("../helpers/fetchFandoms.js");

exports.manageDownloader = async (socket,fandom,choice,callType,method) =>{
    console.log(clc.blue('[connection] manageDownloader'));
    const opts = {
        logDirectory:`public/logs/downloader`,
        fileNamePattern: callType==='site' ? `<DATE>-manually-${choice}.log` : `<DATE>-cron-${choice}.log`,
        dateFormat:'YYYY.MM.DD'
    };
    const log = logger.createRollingFileLogger( opts );

    try {
        if(fandom=='All'){
            let allFandoms = await fetchFandoms(), promises = [];
            if(allFandoms){
                let p = Promise.resolve();
                switch (choice) {
                    case 'getFandomFanficsPartial':
                        await allFandoms.map(async fandom => promises.push(
                            await new Promise(resolve => setTimeout(resolve, 30000)),
                            p = p.then(() => funcs.getFandomFanfics(socket,log,fandom,'partial') )                             
                        ))
                        break;  
                    case 'getFandomFanficsFull':
                            console.log('---  not stand by full')
                            await allFandoms.map(async fandom => promises.push(
                                await new Promise(resolve => setTimeout(resolve, 30000)),
                                p = p.then(() => funcs.getFandomFanfics(socket,log,fandom,'full') )                             
                            ))
                            break;                                        
                    case 'getDeletedFanfics':
                        await allFandoms.map(async fandom => promises.push(
                            await new Promise(resolve => setTimeout(resolve, 30000)),
                            p = p.then(() => funcs.getDeletedFanfics(socket, log, fandom) )                                                          
                        ))
                        break;
                    case 'saveFanfics':
                        // TODO: CHECK THIS FUNC - WHAT SHE IS USES FOR 
                        await allFandoms.map(fandom => promises.push(
                            p = p.then(() => funcs.downloadFanficsToServerHandler(socket,fandom,method) )                                                                                                                   
                        ))
                        break;
                    case 'checkIfFileExsists':
                        // TODO: CHECK THIS FUNC - WHAT SHE IS USES FOR 
                        await allFandoms.map(fandom => promises.push(
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
                    await funcs.getFandomFanfics(socket,log,fandom,'partial')
                    break; 
                case 'getFandomFanficsFull':
                        console.log('--- stand by full')
                    await funcs.getFandomFanfics(socket,log,fandom,'full')
                    break;                
                case 'getDeletedFanfics':
                    await funcs.getDeletedFanfics(socket, log, fandom)
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
