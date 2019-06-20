
const clc = require("cli-color");
const db  =  require('./db')
const ao3 =  require('./ao3')

exports.manageDownloader = async (socket,fandom) =>{
    console.log(clc.blue('[connection] manageDownloader'));
    try {
        if(fandom=='All'){
            console.log('---1---')
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

                await fetchedFandoms.map(fandom => promises.push(  
                    p = p.then(() => manageFandomFanficsHandler(socket,fandom) )                               
                ))
    
                return null;

            }else{
                console.log(clc.cyanBright(`Server got error in manageDownloader`));
                socket && socket.emit('getFanficsData', `<span style="color:red"><b>Server got error in manageDownloader</b></span>`);   
                return null;             
            }


        }else{
            console.log('---2---')
            await manageFandomFanficsHandler(socket,fandom)
        }



        // console.log(clc.cyanBright(`End`));
        // socket && socket.emit('getFanficsData', 'End');
        return null
    } catch(e) {
        console.log(e);
    }
}

const manageFandomFanficsHandler = async (socket,fandom) => {
    const {FandomName,SearchKeys} = fandom

    console.log(clc.cyanBright(`Server got fandom: ${FandomName}`));
    socket && socket.emit('getFanficsData', `<b>Server got fandom:</b> ${FandomName}`);

    console.log(clc.cyanBright(`Server got keys: ${SearchKeys}`));
    socket && socket.emit('getFanficsData', `<b>Server got keys:</b> ${SearchKeys}`);
    

    let fandomUrlName = SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
    socket && socket.emit('getFanficsData', `<b>Fixing keys to match url search:</b> ${fandomUrlName}`);

    console.log(clc.cyanBright(`Executing: getFanficsOfFandom()`));
    socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">getFanficsOfFandom()</span>`);

    let fanficsLength = await ao3.getFanficsOfFandom(fandom);
    
    console.log(clc.cyanBright(`Fanfics data of ${FandomName} was updated!`));
    socket && socket.emit('getFanficsData', `<span style="color:green"><b>Fanfics data of ${FandomName} was updated!:</b></span>`)

    console.log(clc.cyanBright(`Got ${fanficsLength} from getFanficsOfFandom()`)),
    socket && socket.emit('getFanficsData', `Got ${fanficsLength} from <span style="color:brown">getFanficsOfFandom()</span>`)
  

    console.log(clc.cyanBright(`End`));
    socket && socket.emit('getFanficsData', `End`);
}