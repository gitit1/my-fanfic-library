const clc = require("cli-color");
const cheerio = require('cheerio');

const {getDataFromFanficPage} = require('./getDataFromFanficPage/getDataFromFanficPage');
const pLimit = require('p-limit');

exports.getDataFromAO3FandomPage =  async (jar,page,fandom,savedNotAuto) => {  
    // console.log(clc.blue('[ao3 controller] getDataFromAO3FandomPage()'));
    try {
        let $ = cheerio.load(page),donePromise = 0;
        let n = $('ol.work').children('li').length;
        const limit = pLimit(1)  
        let promises = [];
        let counter;
        for(let count = 0; count < n; count++){
            console.log('sleeping...');
            await sleep(8000);
            console.log('done sleeping...');
            let page = $('ol.work').children('li').eq(count);
            // await promises.push(limit(() =>{
            //     getDataFromFanficPage(jar,page,fandom.FandomName,fandom.SavedFanficsLastUpdate,fandom.AutoSave,fandom.SaveMethod,savedNotAuto)
            // } ));

            await getDataFromFanficPage(jar,page,fandom.FandomName,fandom.SavedFanficsLastUpdate,fandom.AutoSave,fandom.SaveMethod,savedNotAuto).then(res=>{
                donePromise++;
                res===0 && counter++;   
            }).then(()=>{new Promise(resolve => setTimeout(() => resolve(), 7000))})
            if (donePromise == n) {return counter}                
        }
        // await Promise.all(promises).then(async results=> {
        //     return n;
        // });
        
    } catch(e) {console.log(e);}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }