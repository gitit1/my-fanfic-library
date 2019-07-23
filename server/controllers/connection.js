
const clc = require("cli-color");
const db  =  require('./db')
const ao3 =  require('./ao3')
const now  = require('performance-now')

const FandomModal = require('../models/Fandom');

exports.manageDownloader = async (socket,fandom,choice,method) =>{
    console.log(clc.blue('[connection] manageDownloader'));
    try {
        if(fandom=='All'){
            let fetchedFandoms = await db.getAllFandoms().then(fetchedFandoms=>{
                console.log('fetchedFandoms:',fetchedFandoms)
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
                    case 'getFandomFanfics':
                        await fetchedFandoms.map(fandom => promises.push(
                            p = p.then(() => manageFandomFanficsHandler(socket,fandom) )                               
                        ))
                        break;                
                    case 'getDeletedFanfics':
                        await fetchedFandoms.map(fandom => promises.push(
                            p = p.then(() => manageDeletedFanficsHandler(socket,fandom) )                                                          
                        ))
                        break;
                    case 'saveFanfics':
                        await fetchedFandoms.map(fandom => promises.push(
                            p = p.then(() => downloadFanficsToServerHandler(socket,fandom,method) )                                                          
                        ))
                        break;
                    case 'All'://TODO:need to add to client side
                        await fetchedFandoms.map(fandom => promises.push(
                            p = p.then(() => manageFandomFanficsHandler(socket,fandom) )                           
                            // p = p.then(() => manageFandomFanficsHandler(socket,fandom) ),                              
                            // p = p.then(() => manageDeletedFanficsHandler(socket,fandom) )                           
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
                    await manageFandomFanficsHandler(socket,fandom)
                    break;                
                case 'getDeletedFanfics':
                    await manageDeletedFanficsHandler(socket,fandom)
                    break;
                case 'saveFanfics':
                    await downloadFanficsToServerHandler(socket,fandom,method)
                    break;
                case 'All':
                    await manageFandomFanficsHandler(socket,fandom)
                    await manageFandomFanficsHandler(socket,fandom)
                    break;
            }
            
        }



        // console.log(clc.cyanBright(`End`));
        // socket && socket.emit('getFanficsData', 'End');
        return null
    } catch(e) {
        console.log(e);
    }
}

const manageFandomFanficsHandler = async (socket,fandom) => {
    const {FandomName,SearchKeys,AutoSave,SaveMethod} = fandom

    console.log(clc.cyanBright(`Server got fandom: ${FandomName}`));
    socket && socket.emit('getFanficsData', `<b>Server got fandom:</b> ${FandomName}`);

    console.log(clc.cyanBright(`Server got keys: ${SearchKeys}`));
    socket && socket.emit('getFanficsData', `<b>Server got keys:</b> ${SearchKeys}`);
    

    let fandomUrlName = SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
    socket && socket.emit('getFanficsData', `<b>Fixing keys to match url search:</b> ${fandomUrlName}`);

    console.log(clc.cyanBright(`Executing: getFanficsOfFandom()`));
    socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">getFanficsOfFandom()</span>`);

    let startTime = now(); 
    let fanficsLengths = await ao3.getFanficsOfFandom(fandom,null,socket);
    console.log('fanficsLengths:',fanficsLengths)
    let endTime = now();
    console.log(clc.cyanBright(`Fanfics data of ${FandomName} was updated!`));
    socket && socket.emit('getFanficsData', `<span style="color:green"><b>Fanfics data of ${FandomName} was updated!:</b></span>`)
    socket && socket.emit('getFanficsData', `<b>The function:</b> <span style="color:brown">getFanficsOfFandom()</span> was running for ${((endTime-startTime)/1000).toFixed(2)} seconds`);

    console.log(clc.cyanBright(`Got ${fanficsLengths[0]} from getFanficsOfFandom()`)),
    socket && socket.emit('getFanficsData', `Got ${fanficsLengths[0]} from <span style="color:brown">getFanficsOfFandom()</span>`)
  
    console.log(clc.cyanBright(`Saved ${fanficsLengths[1]} to Server`)),
    socket && socket.emit('getFanficsData', `Saved ${fanficsLengths[1]} to Server`)

    console.log(clc.cyanBright(`End`));
    socket && socket.emit('getFanficsData', `End`);
}

const manageDeletedFanficsHandler = async (socket,fandom) => {
    const {FandomName,FanficsInFandom} = fandom    

    console.log(clc.cyanBright(`Server got fandom: ${FandomName}`));
    socket && socket.emit('getFanficsData', `<b>Server got fandom:</b> ${FandomName}`);

    console.log(clc.cyanBright(`Executing: checkIfDeletedFromAO3()`));
    socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">checkIfDeletedFromAO3()</span>`);

    let startTime = now(); 
    let deletedCounters = await ao3.checkIfDeletedFromAO3(FandomName,FanficsInFandom);
    console.log('deletedCounters',deletedCounters)
    let endTime = now();
    console.log(clc.cyanBright(`Deleted Fanfics data of ${FandomName} was updated!`));
    socket && socket.emit('getFanficsData', `<span style="color:green"><b>Deleted Fanfics data of ${FandomName} was updated!:</b></span>`)
    socket && socket.emit('getFanficsData', `<b>The function:</b> <span style="color:brown">checkIfDeletedFromAO3()</span> was running for ${((endTime-startTime)/1000).toFixed(2)} seconds`);
    socket && socket.emit('getFanficsData', `<b>Number of New Deleted fanfics:</b> <span style="color:red">${deletedCounters[0]}</span>`);
    socket && socket.emit('getFanficsData', `<b>Number of All Deleted fanfics:</b> <span style="color:red">${deletedCounters[1]}</span>`);

    console.log(clc.cyanBright(`End`));
    socket && socket.emit('getFanficsData', `End`);
}

const downloadFanficsToServerHandler = async (socket,fandom,method) => {
    const {FandomName} = fandom    

    console.log(clc.cyanBright(`Server got fandom: ${FandomName}`));
    socket && socket.emit('getFanficsData', `<b>Server got fandom:</b> ${FandomName}`);

    socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">getFanficsOfFandom()</span> to get the most updated fanfics`);

    let startTime = now(); 
    let savedCounters = await ao3.saveFanficsToServer(fandom,method);
    console.log('savedCounters',savedCounters)
    let endTime = now();

    console.log(clc.cyanBright(`Saved ${savedCounters[1]} Fanfics to ${FandomName} Fandom!`));
    socket && socket.emit('getFanficsData', `Saved ${savedCounters[1]} Fanfics to ${FandomName} Fandom!</b></span>`)
    socket && socket.emit('getFanficsData', `<b>The function:</b> <span style="color:brown">saveFanficsToServer()</span> was running for ${((endTime-startTime)/1000).toFixed(2)} seconds`);
    //TODO: add to fandom model - last time of saved fanfics - then compare it in saveFanficsToServer() - if null - this is an init , if not this is an update

    console.log(clc.cyanBright(`End`));
    socket && socket.emit('getFanficsData', `End`);   
} 