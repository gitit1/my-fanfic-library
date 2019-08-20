const clc = require("cli-color");
const cheerio = require('cheerio');

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});
const {getDataFromFanficPage} = require('./getDataFromFanficPage/getDataFromFanficPage');

exports.getDataFromAO3FandomPage =  async (page,fandom,savedNotAuto) => {  
    console.log(clc.blue('[ao3 controller] getDataFromAO3FandomPage()'));    
        try {
            let $ = cheerio.load(page),donePromise = 0;
            let n = $('ol.work').children('li').length;
            let counter = 0,timer = 0;
            for(let count = 0; count < n; count++){
                let page = $('ol.work').children('li').eq(count)
                    await getDataFromFanficPage(page,fandom.FandomName,fandom.SavedFanficsLastUpdate,fandom.AutoSave,fandom.SaveMethod,savedNotAuto).then(res=>{
                        donePromise++;
                        res===0 && counter++;

                    })
                    if (donePromise == n) {return counter}                
            }
            
        } catch(e) {console.log(e);}
}