const clc = require("cli-color");
const cheerio = require('cheerio');
let request = require('request')
const pLimit = require('p-limit');
const log = require('log-to-file');

const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');
const ao3Funcs = require('./functions')

exports.ao3GetFanfics =  async (jar,fandom,method) => {
    // TODO: ADD CHOSE FANFDOM FOR THE DOWNLOADER
    // TODO: IF WE SAVE FILE - ADD THE MISSING DATA TO DB
    console.log(clc.blue('[ao3 controller] ao3GetFanfics()'));
    request = request.defaults({jar: jar,followAllRedirects: true});
    
    await ao3Funcs.loginToAO3(jar);
    // console.log('method is:',method)
    const savedNotAuto = (method||!method===null) ? method : null;   
    const {FandomName,SearchKeys,SavedFanficsLastUpdate} = fandom;
    
    let today = (new Date()).toString("yyyy-MM-dd")
    log(`-----------------------------New Session--------------------------`, `public/logs/${today} - ${FandomName}`); 
       
    let fandomUrlName = SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
    const ao3URL = `https://archiveofourown.org/tags/${fandomUrlName}/works`;
    
    let numberOfPages = 0,fanficsInFandom,savedFanficsCurrent=0;

    let body = await ao3Funcs.getUrlBodyFromAo3(jar,ao3URL)
            
    let $ = cheerio.load(body);
            
    if(Number($('#main').find('ol.pagination li').eq(-2).text())===0){
        numberOfPages = 1
    }else if(Number($('#main').find('ol.pagination li').eq(-2).text())>=10){
        numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text())+1;
    }else{
        numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text());
    }

    let pagesArray = await ao3Funcs.getPagesOfFandomData(jar,ao3URL,numberOfPages);

    const limitConn = (SavedFanficsLastUpdate===undefined) ? 1 : 1;

    const limit = pLimit(limitConn)

    let promises2 = [];
                               
    for (let i = 0; i < pagesArray.length; i++) {
        promises2.push(limit(() =>{ao3Funcs.getDataFromAO3FandomPage(jar,pagesArray[i],fandom,savedNotAuto)} ));
    }
  
    await Promise.all(promises2).then(async results=> {
        let counterArray = results.filter(function(num) {return (!isNaN(num)); });
        savedFanficsCurrent = savedFanficsCurrent + counterArray.reduce((a, b) => a + b, 0);
    });
            

    fanficsInFandom = await mongoose.dbFanfics.collection(FandomName).countDocuments({});

    const AO3FanficsInFandom = await mongoose.dbFanfics.collection(FandomName).countDocuments({'Source':'AO3'});
    const AO3CompleteFanfics = await mongoose.dbFanfics.collection(FandomName).countDocuments({'Source':'AO3','Complete':true});
    const AO3SavedFanfics = await mongoose.dbFanfics.collection(FandomName).countDocuments({'Source':'AO3','SavedFic':true});
    AO3SavedFanfics===0 ? savedFanficsCurrent : AO3SavedFanfics;
    const AO3OnGoingFanfics =  AO3FanficsInFandom-AO3CompleteFanfics;

    await FandomModal.updateOne({ 'FandomName': FandomName },
                                { $set: { 'FanficsInFandom':fanficsInFandom, 
                                        'AO3.FanficsInFandom':AO3FanficsInFandom, 
                                        'AO3.CompleteFanfics':AO3CompleteFanfics, 
                                        'AO3.OnGoingFanfics':AO3OnGoingFanfics,
                                        'AO3.SavedFanfics':AO3SavedFanfics,
                                        'LastUpdate':new Date().getTime(),
                                        'FanficsLastUpdate':new Date().getTime(),
                                        'SavedFanficsLastUpdate':new Date().getTime()
                                }},
        (err, result) => {
            if (err) throw err;
            
        }
    );

    return [AO3FanficsInFandom,savedFanficsCurrent]  
        
}
