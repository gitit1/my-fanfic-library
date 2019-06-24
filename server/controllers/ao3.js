const clc = require("cli-color");
const cheerio = require('cheerio');
const mongoose = require('../config/mongoose');

const FandomModal = require('../models/Fandom');
const FanficSchema = require('../models/Fanfic');

const func = require('../helpers/functions');
const now  = require('performance-now')

const ao3UserKeys = require("../config/keys");
let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});


exports.getFanficsOfFandom =  async (fandom) => {
   console.log(clc.blue('[ao3 controller] getFanficsOfFandom()'));
   
   await this.loginToAO3()
   
   const {FandomName,SearchKeys} = fandom;
   
   let fandomUrlName = SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
   const ao3URL = `https://archiveofourown.org/tags/${fandomUrlName}/works`;
   
   let numberOfPages = 0; let promises = [], FanficsInFandom;

   let body = await getUrlBodyFromAo3(ao3URL)
         
   let $ = cheerio.load(body);
        
   if(Number($('#main').find('ol.pagination li').eq(-2).text())===0){
       numberOfPages = 1
   }else if(Number($('#main').find('ol.pagination li').eq(-2).text())>=10){
       numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text())+1;
   }else{
       numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text());
   }
   
   let pagesArray = await getPagesOfFandomData(ao3URL,numberOfPages);
   
   await pagesArray.map(page => promises.push(   
        func.delay(3000).then(async () => await getDataFromAO3FandomPage(page,FandomName))  
        //getDataFromAO3FandomPage(page,FandomName)           
    ))

//    const reflect = p => p.then(v => ({v, status: "fulfilled" }),
//    e => ({e, status: "rejected" }));


   await Promise.all(promises).then(async () => {
       FanficsInFandom = await mongoose.dbFanfics.collection(FandomName).countDocuments({});
       let CompleteFanfics = await mongoose.dbFanfics.collection(FandomName).countDocuments({'Complete':true});
       let OnGoingFanfics =  FanficsInFandom-CompleteFanfics;
   
       await FandomModal.updateOne({ 'FandomName': FandomName },
                                   { $set: { 'FanficsInFandom':FanficsInFandom, 
                                           'CompleteFanfics':CompleteFanfics, 
                                           'OnGoingFanfics':OnGoingFanfics,
                                           'FanficsLastUpdate':new Date().getTime()}},
           (err, result) => {
               if (err) throw err;
               
           }
       )
   })    
  return FanficsInFandom 

}

const getDataFromAO3FandomPage =  async (page,FandomName) => {
    console.log(clc.blue('[ao3 controller] getDataFromAO3FandomPage()'));    
        try {
            let $ = cheerio.load(page),donePromise = 0;
            let n = $('ol.work').children('li').length;
            
            for(let count = 0; count < n; count++){
                let page = $('ol.work').children('li').eq(count)
                let getData = await getDataFromPage(page,FandomName)
                getData && donePromise++;
                if (donePromise == n) {
                    return
                }                
            }
 
        } catch(e) {
            console.log(e);
        }



}

const getDataFromPage = async (page,fandomName) =>{
    
    let fanfic = {}
    let oldFanficData = false

    fanfic["Source"]                =       'AO3';
    fanfic["FanficID"]              =       Number(page.attr('id').replace('work_',''));
    fanfic["LastUpdateOfNote"]      =       new Date().getTime();

    //TODO: check in saveFanficToDB:
    // let fandom = await mongoose.dbFanfics.collection(fandomName).findOne({FanficID: fanfic["FanficID"]})
    // fandom!==null && (oldFanficData = fandom)
    // fanfic["SavedFic"]              =       oldFanficData ? oldFanficData.SavedFic : false;
    fanfic["SavedFic"]              =       false;

    fanfic["FanficTitle"]           =       page.find('div.header h4 a').first().text();
    fanfic["URL"]                   =       'https://archiveofourown.org'+ page.find('div.header h4 a').first().attr('href');
    fanfic["Author"]                =       page.find('div.header h4 a').last().text();
    fanfic["AuthorURL"]             =       'https://archiveofourown.org'+ page.find('div.header h4 a').last().attr('href');
    fanfic["LastUpdateOfFic"]       =       page.find('p.datetime').text() ==="" ? 0 : new Date(page.find('p.datetime').text()).getTime();
    
    rating = page.find('span.rating span').text();
    switch(rating){
        case 'General Audiences':       {rating = 'general'; break}                             
        case 'Teen And Up Audiences':   {rating = 'teen'; break}    
        case 'Mature':                  {rating = 'mature'; break}    
        case 'Explicit':                {rating = 'explicit'; break}    
        case 'Not Rated':               {rating = 'none'; break}  
        default:                        rating = 'none';
    }
    fanfic["Rating"]                =       rating;

    let tags =[],warnings =[],relationships =[],characters =[],freeforms =[],fandomsTags=[];
    page.find('ul.tags').children('li').each(index => {
        let tag = page.find('ul.tags').children('li').eq(index);
        switch(tag.attr('class')){
            case 'warnings':        {warnings.push(tag.text()); break}                             
            case 'relationships':   {relationships.push(tag.first().text()); break}    
            case 'characters':      {characters.push(tag.first().text()); break}    
            case 'freeforms':       {freeforms.push(tag.first().text()); break}            
        }               
    });
    if(warnings[0]=='No Archive Warnings Apply'||warnings[0]=='Creator Chose Not To Use Archive Warnings'){
        tags.push({'relationships':relationships},{'characters':characters},{'tags':freeforms});
    }else{
        tags.push({'warnings':warnings},{'relationships':relationships},{'characters':characters},{'tags':freeforms});
    }   
    fanfic["Tags"]                  =       tags;

    page.find('div.header h5').children('a').each(index => {
        let tag = page.find('div.header h5').children('a').eq(index);
        fandomsTags.push(tag.text())
    });
    fanfic["FandomsTags"]           =       fandomsTags;
    
    fanfic["Description"]           =       page.find('blockquote.summary').html();
    fanfic["Hits"]                  =       page.find('dd.hits').text() ===""  ? 0 : Number(page.find('dd.hits').text());
    fanfic["Kudos"]                 =       page.find('dd.kudos').text() ==="" ? 0 : Number(page.find('dd.kudos').text()); 
    fanfic["Language"]              =       page.find('dd.language').text()  
    fanfic["Comments"]              =       (page.find('dd.comments').text()) ==="" ? 0 : Number(page.find('dd.comments').text()); 
    fanfic["Bookmarks"]             =       (page.find('dd.bookmarks').text()) ==="" ? 0 : Number(page.find('dd.bookmarks').text()); 
    fanfic["Words"]                 =       page.find('dd.words').text(); 
    fanfic["NumberOfChapters"]      =       Number(page.find('dd.chapters').text().split('/')[0]);  

    chapCurrent = page.find('dd.chapters').text().split('/')[0]
    chapEnd = page.find('dd.chapters').text().split('/')[1]
    fanfic["Complete"] = (String(chapEnd) !== '?' && (Number(chapCurrent)===Number(chapEnd)) ) ? true : false
    fanfic["Oneshot"]  = (fanfic["Complete"] && fanfic["NumberOfChapters"]===1) ? true : false 
    

    
    await saveFanficToDB(fandomName,fanfic).then(async () =>{
        return await true        
    })
}

exports.loginToAO3 = async ()=>{
    console.log(clc.bgGreenBright('[ao3 controller] loginToAO3()'));
    let url = "https://archiveofourown.org/users/login/",utf8='',authenticity_token='',isLogin = false;
 
    request.get({
        url: url,
        jar: jar,
        credentials: 'include'
    }, async function (err, httpResponse, body) {
        let $ = cheerio.load(body);
        authenticity_token  = await $('#new_user').find("input[name = 'authenticity_token']").attr('value')
        utf8                = await $('#new_user').find("input[name = 'utf8']").attr('value')
        let details = {
            'utf8': utf8,
            'authenticity_token': authenticity_token,
            'user[login]': ao3UserKeys.ao3User,
            'user[password]':ao3UserKeys.ao3Password,
            'user[remember_me]':0,
            'commit':'Log in'
        };
        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
        isLogin = await ($('#greeting').length > 0) ? true : false;
        !isLogin?(
            request({
                url,
                method: 'POST',
                body: formBody,
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                },
                jar: jar,
                credentials: 'include',
            }, async function (err, httpResponse, body) { 
                let $ = cheerio.load(body);
                isLogin = await ($('#greeting').length > 0) ? true : false
                isLogin ? console.log(clc.green('logged in successfully to ao3')) : console.log(clc.red('Error in Loggging in'))
                return
            })   
        ):console.log(clc.green('you are already logged in to ao3')) 
    })
}

//TODO: NEED TO FIX ERRORS,  place to the place I want it (cron), change it to be inside function and not router
exports.checkIfDeletedFromAO3 = async (req,res) =>{  
    console.log(clc.bgGreenBright('[ao3 controller] checkIfDeletedFromAO3()'));
    //TODO: need to get from client
    let fandomName = 'Clexa';
    // let fanficsSum = 500;
    let fanficsSum = 10788
    
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    let startTime = now(); 
    let skip=0,limit=100,promises=[],promises2=[],gotDeletedList = [];
    let loop = Math.ceil(fanficsSum/limit)
 
    const findNextBunchOfFanfics = () =>{
        console.log('findNextBunchOfFanfics: skip: '+skip+' , limit: '+limit)
        return new Promise(function(resolve, reject) {
            FanficDB.find({Source:'AO3'}).skip(skip).limit(limit).exec(async function(err, fanfics) { 
                await fanfics.map((fanfic, index) => promises.push(!fanfic.Deleted && checkIfDeleted(fanfic.URL,fanfic)) );
        
                Promise.all(promises).then(async () => {
                    console.log('then 1'); 
                    await gotDeletedList.forEach(async function(fanfic, index) {
                        fanfic.LastUpdateOfNote=new Date().getTime();
                        console.log(`${fanfic.FanficTitle} got deleted`)
                        await mongoose.dbFanfics.collection(fandomName).updateOne({ 'FanficID': fanfic.FanficID},{$set: {Deleted:true}}, async function (error, response) {
                            //console.log(`${fanfic.FanficTitle} updated as deleted`)
                        })
                        await mongoose.dbFanfics.collection('deletedFanfics').insertOne(fanfic, async function (error, response) {
                            //console.log(`${fanfic.FanficTitle} saved to deleted list`)                   
                        })     
                    })
                }).then(()=>{
                    resolve()
                })
            
            });
        });
    }

    const checkIfDeleted = (url,fanfic) =>{
        console.log('checkIfDeleted: '+fanfic.FanficID)
        return new Promise(function(resolve, reject) {
            request.get({url,jar: jar,credentials: 'include'}, async function (err, httpResponse, body) {
                try {
                    func.delay(2000).then(async () => {
                        let $ = cheerio.load(body);
                        if(err){
                            console.log('Error in get ao3URL',err)
                            reject(false)
                        }else{
                            ($('#main h2').text()=='Error 404') && gotDeletedList.push(fanfic);
                            resolve();         
                        } 
                    })         
                }catch (e) {
                    console.log(e) // handle error
                  } 
               
       
            });
        });
    }    

    for(i=0; i<loop; i++){
        skip = (i===0) ? 0 : ((limit*i)-i+1)        
        func.delay(3000).then(async () => await promises2.push(findNextBunchOfFanfics()))  
    }
    await Promise.all(promises2).then(async () => {
        let endTime = now();
        res.send(`finished in ${((endTime-startTime)/1000).toFixed(2)} seconds`)
    });



}

//UTILITIES FOR getFanficsOfFandom()

const getPagesOfFandomData = async (url,numberOfPages) => {
    let pages = [], promises = [];
    await [...Array(Number(numberOfPages))].forEach(async (num,index) => {promises.push(
        new Promise(async(resolve, reject) => {
            request.get({url: `${url}?page=${index+1}`,jar: jar, credentials: 'include'}, async function (err, httpResponse, body) {
                pages.push(body)
                resolve()
            })
        })
    )});

    const reflect = p => p.then(v => ({v, status: "fulfilled" }),
    e => ({e, status: "rejected" }));

    await Promise.all(promises.map(reflect))
    promises = []
    return pages

}

const getUrlBodyFromAo3 = url =>{
    return new Promise(function(resolve, reject) {
        request.get({url,jar, credentials: 'include'}, function (err, httpResponse, body) {
            if(err){
                console.log('Error in get ao3URL',err)
                reject(false)
            }else{
                resolve(body)
            }        
        });
    });
}
//UTILITIES FOR getDataFromAO3FandomPage()

const saveFanficToDB = (fandomName,fanfic) =>{
    console.log(clc.bgGreenBright('[ao3 controller] saveFanfficToDB()'));  
    return new Promise(async function(resolve, reject) {
        mongoose.dbFanfics.collection(fandomName).findOne({FanficID: fanfic["FanficID"] }, async function(err, dbFanfic) {
            if (err) { 
                func.delay(1000).then(async () => reject())
                return reject()
            }
            let isExist = (dbFanfic===null) ? false : true;
            if(!isExist){
                mongoose.dbFanfics.collection(fandomName).insertOne(fanfic, async function (error, response) {
                    await func.delay(1000).then(() => resolve())
                    // return resolve()
                });
                
            }else{ 
                mongoose.dbFanfics.collection(fandomName).updateOne({ 'FanficID': fanfic["FanficID"]},{$set: fanfic}, async function (error, response) {
                    await func.delay(1000).then(() => resolve())
                    // return resolve()
                })
            }
        });
    });
}
