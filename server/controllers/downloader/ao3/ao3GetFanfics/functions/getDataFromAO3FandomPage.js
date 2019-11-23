const clc = require("cli-color");
const cheerio = require('cheerio');

const {getDataFromFanficPage} = require('./getDataFromFanficPage/getDataFromFanficPage');

exports.getDataFromAO3FandomPage =  async (jar,page,fandom,savedNotAuto,pagesCount) => {  
    // console.log(clc.blue('[ao3 controller] getDataFromAO3FandomPage()'));  
    try {
        let $ = cheerio.load(page),donePromise = 0;
        let n = $('ol.work').children('li').length;
        let counter;
        for(let count = 0; count < n; count++){
            let page = $('ol.work').children('li').eq(count)
                await getDataFromFanficPage(jar,page,fandom.FandomName,fandom.SavedFanficsLastUpdate,fandom.AutoSave,fandom.SaveMethod,savedNotAuto,pagesCount).then(res=>{
                    donePromise++;
                    res===0 && counter++;

                })
                if (donePromise == n) {return counter}                
        }
        
    } catch(e) {console.log(e);}
}