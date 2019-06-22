const clc = require("cli-color");
const cheerio = require('cheerio');
const mongoose = require('../config/mongoose');

const FandomModal = require('../models/Fandom');

const func = require('../helpers/functions');


let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});


exports.getFanficsOfFandom =  async (fandom) => {
   console.log(clc.blue('[ao3 controller] getFanficsOfFandom()'));

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

    fanfic["FanficID"]         = Number(page.attr('id').replace('work_',''));

    let fandom = await mongoose.dbFanfics.collection(fandomName).findOne({FanficID: fanfic["FanficID"]})
    fandom!==null && (oldFanficData = fandom)

    fanfic["LastUpdateOfNote"]      =       new Date().getTime();
    fanfic["SavedFic"]              =       oldFanficData ? oldFanficData.SavedFic : false;

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
    fanfic["Bookmarks"]              =      (page.find('dd.bookmarks').text()) ==="" ? 0 : Number(page.find('dd.bookmarks').text()); 
    fanfic["Words"]                 =       page.find('dd.words').text(); 
    fanfic["NumberOfChapters"]      =       Number(page.find('dd.chapters').text().split('/')[0]);  

    chapCurrent = page.find('dd.chapters').text().split('/')[0]
    chapEnd = page.find('dd.chapters').text().split('/')[1]
    fanfic["Complete"] = (String(chapEnd) !== '?' && (Number(chapCurrent)===Number(chapEnd)) ) ? true : false

    fanfic["Image"]             = "";
    
    await saveFanfficToDB(fandomName,fanfic).then(async () =>{
        return await true        
    })
}

exports.connectToAO3 = async ()=>{
    let url = "https://archiveofourown.org/users/login/",utf8='',authenticity_token='';
 
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
            'user[login]': process.env.AO3_USERNAME_1,
            'user[password]':process.env.AO3_PASSWORD_1,
            'user[remember_me]':0,
            'commit':'Log in'
        };
        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

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
                let $ = cheerio.load(body),isLogin = false;
                isLogin = await ($('#greeting').length > 0) ? true : false
                isLogin ? console.log(clc.green('logged in successfully to ao3')) : console.log(clc.red('Error in Loggging in'))
                return
            })      
    })
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

const saveFanfficToDB = (fandomName,fanfic) =>{
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
