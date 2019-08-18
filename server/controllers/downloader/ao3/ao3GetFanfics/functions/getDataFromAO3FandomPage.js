const clc = require("cli-color");
const cheerio = require('cheerio');

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});
const {getDataFromPage} = require('./getDataFromPage');


exports.getDataFromAO3FandomPage =  async (page,fandom,savedNotAuto) => {  
    console.log(clc.blue('[ao3 controller] getDataFromAO3FandomPage()'));    
        try {
            let $ = cheerio.load(page),donePromise = 0;
            let n = $('ol.work').children('li').length;
            let counter = 0,timer = 0;
            // return new Promise(async function(resolve, reject) {
                for(let count = 0; count < n; count++){
                    let page = $('ol.work').children('li').eq(count)
                    // timer = (fandom.SavedFanficsLastUpdate===undefined) ? 6000 : 1000;
                    // func.delay(timer).then(async () => {
                        await getDataFromPage(page,fandom.FandomName,fandom.SavedFanficsLastUpdate,fandom.AutoSave,fandom.SaveMethod,savedNotAuto).then(res=>{
                            donePromise++;
                            // console.log('res:',res)
                            res===0 && counter++;
                            // if(res!==0){
                            //     console.log(clc.red('page:',page.attr('id')))
                            // }

                        })
                        // console.log('donePromise:',donePromise)
                        // console.log('counter:',counter)
                        if (donePromise == n) {   
                            // console.log('.......:')
                            // console.log('1.1',counter)                
                            // resolve(counter)
                            return counter
                        }                
                    // });
                }
            // })
            //return counter
            
 
        } catch(e) {
            console.log(e);
        }



}