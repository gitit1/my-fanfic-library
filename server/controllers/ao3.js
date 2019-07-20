const clc = require("cli-color");
const cheerio = require('cheerio');
const mongoose = require('../config/mongoose');

const FandomModal = require('../models/Fandom');
const FanficSchema = require('../models/Fanfic');

const fs = require('fs');

const func = require('../helpers/functions');
const moment = require('moment');

const ao3UserKeys = require("../config/keys");
let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});
const fanficsPath = "public/fandoms"


exports.getFanficsOfFandom =  async (fandom,method) => {
   console.log(clc.blue('[ao3 controller] getFanficsOfFandom()'));

    await this.loginToAO3()
   const savedNotAuto = method ? method : null;   
   const {FandomName,SearchKeys,SaveMethod,AutoSave} = fandom;
   
   let fandomUrlName = SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
   const ao3URL = `https://archiveofourown.org/tags/${fandomUrlName}/works`;
   
   let numberOfPages = 0; let promises = [],fanficsInFandom,savedFanficsCurrent=0;

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


    // await pagesArray.map(page => promises.push(getDataFromAO3FandomPage(page,fandom,savedNotAuto)))


        let promises2 = [],sum = pagesArray.length,loop=0,loom_ir=0,index=Math.ceil(pagesArray.length/100);
        console.log('index:',index)
        while(index>0){
            promises2 = []
            index--;
            console.log('index:',index)
            loop = (sum>100) ? 100 : sum
            sum =  (sum>100) ? sum-100 : sum;

            console.log(clc.redBright('I am in a loop:',loop))
            console.log(clc.redBright('sum:',sum))
            console.log(clc.redBright('loom_ir:',loom_ir))
            for (let i = 0; i < loop; i++) {
                // console.log('i: '+i)
                // console.log('pagesArray[i+(loom_ir*100)]: '+(i+(loom_ir*100)))
                promises2.push(getDataFromAO3FandomPage(pagesArray[i+(loom_ir*100)],fandom,savedNotAuto));
            }
            // console.log('promises2: ',promises2.length)
            await Promise.all(promises2).then(async results=> {
                // console.log('results:',results) 
                let counterArray = results.filter(function(num) {return (!isNaN(num)); });
                savedFanficsCurrent = savedFanficsCurrent + counterArray.reduce((a, b) => a + b, 0);
            });
            loom_ir++;
            // let result = await getDataFromAO3FandomPage(pagesArray[index],fandom,savedNotAuto);
            // results.push(result)    
        }              
        console.log('savedFanficsCurrent:',savedFanficsCurrent)
        fanficsInFandom = await mongoose.dbFanfics.collection(FandomName).countDocuments({});
        console.log('fanficsInFandom:',fanficsInFandom)
        const completeFanfics = await mongoose.dbFanfics.collection(FandomName).countDocuments({'Complete':true});
        const savedFanficsAll = await mongoose.dbFanfics.collection(FandomName).countDocuments({'SavedFic':true});
        savedFanficsAll===0 ? savedFanficsCurrent : savedFanficsAll;
        const onGoingFanfics =  fanficsInFandom-completeFanfics;

        await FandomModal.updateOne({ 'FandomName': FandomName },
                                   { $set: { 'FanficsInFandom':fanficsInFandom, 
                                           'CompleteFanfics':completeFanfics, 
                                           'OnGoingFanfics':onGoingFanfics,
                                           'SavedFanfics':savedFanficsAll,
                                           'FanficsLastUpdate':new Date().getTime(),
                                           'SavedFanficsLastUpdate':new Date().getTime()
                                   }},
           (err, result) => {
               if (err) throw err;
               
           }
        );

        console.log('[fanficsInFandom,savedFanficsCurrent] :',[fanficsInFandom,savedFanficsCurrent] )
        console.log('1')
        return [fanficsInFandom,savedFanficsCurrent]  
        
        //TODO: check on server if work without getting stuck
//    await Promise.all(promises).then(async results => {
//         console.log('results:',results)
//         let counterArray = results.filter(function(num) {return (!isNaN(num)); });
//         savedFanficsCurrent = await counterArray.reduce((a, b) => a + b, 0);
//         console.log('savedFanficsCurrent:',savedFanficsCurrent)
//         fanficsInFandom = await mongoose.dbFanfics.collection(FandomName).countDocuments({});
//         console.log('fanficsInFandom:',fanficsInFandom)
//         const completeFanfics = await mongoose.dbFanfics.collection(FandomName).countDocuments({'Complete':true});
//         const savedFanficsAll = await mongoose.dbFanfics.collection(FandomName).countDocuments({'SavedFic':true});
//         savedFanficsAll===0 ? savedFanficsCurrent : savedFanficsAll;
//         const onGoingFanfics =  fanficsInFandom-completeFanfics;

//         await FandomModal.updateOne({ 'FandomName': FandomName },
//                                    { $set: { 'FanficsInFandom':fanficsInFandom, 
//                                            'CompleteFanfics':completeFanfics, 
//                                            'OnGoingFanfics':onGoingFanfics,
//                                            'SavedFanfics':savedFanficsAll,
//                                            'FanficsLastUpdate':new Date().getTime(),
//                                            'SavedFanficsLastUpdate':new Date().getTime()
//                                    }})
//    })    
//  console.log('[fanficsInFandom,savedFanficsCurrent] :',[fanficsInFandom,savedFanficsCurrent] )
//  return [fanficsInFandom,savedFanficsCurrent] 

}
const getDataFromAO3FandomPage =  async (page,fandom,savedNotAuto) => {  
    // console.log(clc.blue('[ao3 controller] getDataFromAO3FandomPage()'));    
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
const getDataFromPage = async (page,fandomName,savedFanficsLastUpdate,autoSave,saveMethod,savedNotAuto) =>{
    
    let fanfic = {}
    let counter = -1
    let oldFanficData = false
    let updated = false;
    let newFic = false;
    let fandom = null;
    let slowDownload = false;
    let todayDate = new Date();
    let thisYear = String(todayDate.getFullYear());
    // let timer = 0;

    fanfic["LastUpdateOfNote"]      =       todayDate.getTime();

    fanfic["FandomName"]            =       fandomName;
    fanfic["Source"]                =       'AO3';
    fanfic["FanficID"]              =       Number(page.attr('id').replace('work_',''));
    fanficUpdateDate                =       page.find('p.datetime').text();
    fanfic["LastUpdateOfFic"]       =       fanficUpdateDate ==="" ? 0 : new Date(fanficUpdateDate).getTime();

    fanfic["NumberOfChapters"]      =       Number(page.find('dd.chapters').text().split('/')[0]);  

    chapCurrent = page.find('dd.chapters').text().split('/')[0]
    chapEnd = page.find('dd.chapters').text().split('/')[1]
    fanfic["Complete"] = (String(chapEnd) !== '?' && (Number(chapCurrent)===Number(chapEnd)) ) ? true : false
    fanfic["Oneshot"]  = (fanfic["Complete"] && fanfic["NumberOfChapters"]===1) ? true : false 

    fanfic["FanficTitle"]           =       page.find('div.header h4.heading a').first().text();
    fanfic["URL"]                   =       'https://archiveofourown.org'+ page.find('div.header h4 a').first().attr('href');
    fanfic["Author"]                =       page.find('div.header h4.heading a[rel=author]').text();
    fanfic["Author"]                =       (fanfic["Author"]===fanfic["FanficTitle"]||fanfic["Author"]=="") ? 'Anonymous' : fanfic["Author"]

    fanfic["AuthorURL"]             =       'https://archiveofourown.org'+ page.find('div.header h4 a').last().attr('href');

    
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
    fanfic["Words"]                 =       Number(page.find('dd.words').text().replace(/,/g,'')); 

    // fanfic["SavedFic"]              =       false;  
    fanfic["NeedToSaveFlag"]        =       false;
    // console.log('fanfic["Complete"]',fanfic["Complete"])
    // console.log('fanficUpdateDate.includes(thisYear)',fanficUpdateDate.includes(thisYear))
    // console.log('fanfic["Oneshot"]',fanfic["Oneshot"])    
    // let now = moment();
    // let input = moment(new Date(fanficUpdateDate));
    let isThisWeek =  moment(new Date(fanficUpdateDate)).isSame(new Date(), 'week')

    // if(  (!fanfic["Oneshot"] ) &&( 
    //     (fanfic["Complete"]  && fanficUpdateDate.includes(thisYear)) ||
    //     (!fanfic["Complete"] && fanficUpdateDate.includes(thisYear))
    //     // ||(chapCurrent===1 && String(chapEnd) === '?' && isThisWeek)
    // ))
    
    if(isThisWeek){
        
        fandom = await mongoose.dbFanfics.collection(fandomName).findOne({FanficID: fanfic["FanficID"]})
        fandom!==null && (oldFanficData = fandom)
        updated =   (fanfic["FanficTitle"] !== oldFanficData.FanficTitle) || 
                    (fanfic["LastUpdateOfNote"] > oldFanficData.LastUpdateOfNote) ||
                    (fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters) ? true : false;
        
        newFic = (fandom===null) ? true : false

        newFic ? console.log(`Saving ${fanfic["FanficTitle"]} into the DB`) : console.log(`${fanfic["FanficTitle"]} was updated this week`)
        // console.log('updated:',updated)
        if (updated||newFic){
            fanfic["NeedToSaveFlag"] = true
        }
    }

    if(savedFanficsLastUpdate===undefined || newFic){
        fanfic["PublishDate"] =  await getPublishDate(fanfic["URL"])
    }

    if((newFic || updated || savedFanficsLastUpdate===undefined) && autoSave){
        // console.log('autoSave && updated')
        // if(savedFanficsLastUpdate===undefined){
        //     slowDownload = true;
        //     // timer = slowMode ? 7000 : 1000;
        // }
        // console.log('slowDownload 2:',slowDownload)
        
        return await saveFanficToServerHandler(fanfic["URL"],fandomName,saveMethod,savedNotAuto).then(async fanficInfo=>{
            // console.log('fanficInfo:',fanficInfo)

            if(Number(fanficInfo[0])>0){
                // console.log('-----')
                fanfic["SavedFic"]   =   true
                fanfic["NeedToSaveFlag"] = false
                fanfic["fileName"] = fanficInfo[1];
                fanfic["savedAs"] =  fanficInfo[2];
                counter = 0
            }else{
                fanfic["SavedFic"]   =   false
                fanfic["NeedToSaveFlag"] = true               
            }
            // return func.delay(timer).then(async () => {
                return saveFanficToDB(fandomName,fanfic).then(async () =>{
                    // console.log('1')
                    return counter  
                }).catch(error=>{
                    console.log('error:::',error)
                    return counter
                })
           // }
            // );
        })
    }else{
        return saveFanficToDB(fandomName,fanfic).then(async () =>{
            // console.log('2')
            return counter  
        }).catch(error=>{
            console.log('error:::',error)
            return error
        }) 
    }  
}
const getPublishDate = async (url)=>{
    console.log(clc.bgGreenBright('[ao3 controller] getPublishDate()'));
    return await new Promise(async function(resolve, reject) {  
        url = url + '?view_adult=true';
        await getUrlBodyFromAo3(url).then(urlBody=>{
            let $ = cheerio.load(urlBody);
            publishDate =  $('dd.published').text()
            // console.log('publishDate 1:',publishDate)
            publishDate = (publishDate) ==="" ? 0 : new Date(publishDate).getTime();
            // console.log('publishDate 2:',publishDate)
            resolve(publishDate)
        });
    });
}

exports.checkIfFileExsistHandler = async (req,res) =>{
    console.log(clc.bgGreenBright('[ao3 controller] checkIfFileExsistHandler()'));
    fandomName = 'Clexa'
    await checkIfFileExsist(fandomName).then(sum=>
        res.send(`saved ${sum} unsaved files`)
    )
}
const checkIfFileExsist = async (fandomName) => {
    let counter = 0,sum = 0;
    await this.loginToAO3();

    const checkIfExist = (fanfic,path,method) =>{
        const fanficId = fanfic.FanficID, fileName = fanfic.fileName, url = fanfic.URL
        // console.log('fileName:',fileName)
        return new Promise(async function(resolve, reject) {
            if (fs.existsSync(path)) {
                resolve(0)
            }else{
                console.log(clc.red(`${path} is not exisisting... redownload it`))
                fanficInfo = await saveFanficToServerHandler(url,fandomName,method,null)
                mongoose.dbFanfics.collection(fandomName).updateOne({FanficID: fanficId},
                                                                    {$set: {SavedFic:true,NeedToSaveFlag:false,fileName:fanficInfo[1],savedAs:fanficInfo[2]}}
                                                                    , async function (error, response) {
                    resolve(1)
                })
  
            }
        })
    }

    return new Promise(async function(resolve, reject) {
        mongoose.dbFanfics.collection(fandomName).find({}).toArray(async function(err, dbFanfic) {
            console.log(' dbFanfic.length:', dbFanfic.length)
            
            for (let index = 0; index < dbFanfic.length; index++) {
                let methods=[]
                let method = dbFanfic[index].savedAs;
                let undefinedFlag = false;
                if (method===undefined){
                    undefinedFlag = true;
                    console.log(clc.red('method is undefined:',dbFanfic[index].FanficID))
                    await FandomModal.findOne({FandomName: fandomName},async function(err, fandom) {
                        (fandom.AutoSave && fandom.SaveMethod.includes(",")) ? methods.push(fandom.SaveMethod) : methods = fandom.SaveMethod.split(',')
                    })
                }else{
                    (!method.includes(",")) ? methods.push(method) : methods = method.split(',');
                }
                if(dbFanfic[index].Deleted===undefined || (dbFanfic[index].Deleted && !dbFanfic[index].Deleted)){
                    await methods.map(async (method) => {
                        path = `${fanficsPath}/${fandomName}/fanfics/${dbFanfic[index].fileName}.${method}`;
                        counter = await checkIfExist(dbFanfic[index],path,method)
                        sum = sum+counter;
                    })
                }
            }
            console.log('sum: ',sum)
            resolve(sum)
        })
    })

}
//TODO: NEED TO FIX ERRORS,  place to the place I want it (cron), change it to be inside function and not router
//somthing is wrong with the promisses if find deleted
//add - send number of deleted to fandom db
exports.checkIfDeletedFromAO3 = async (fandomName,fanficsSum) =>{  
    console.log(clc.bgGreenBright('[ao3 controller] checkIfDeletedFromAO3()'));
    await this.loginToAO3()
    ////checkIfFileExsist(fandomName)   
    
    const FanficDB = mongoose.dbFanfics.model('Fanfic', FanficSchema,fandomName);
    let skip=0,limit=100,promises=[],promises2=[],gotDeletedList = [],DeletedCounter=[],newDeletedCounter=0,allDeletedCounter=0;
    let loop = Math.ceil(fanficsSum/limit)
 
    const findNextBunchOfFanfics = () =>{
        console.log('findNextBunchOfFanfics: skip: '+skip+' , limit: '+limit)
        return new Promise(function(resolve, reject) {
            FanficDB.find({Source:'AO3'}).sort({['LastUpdateOfFic']: -1 , ['LastUpdateOfNote']: 1}).skip(skip).limit(limit).exec(async function(err, fanfics) { 
                err && reject(console.log('error: ',err))
                await fanfics.map((fanfic, index) => promises.push(checkIfDeleted(fanfic)) );
                Promise.all(promises).then(async () => {
                    resolve()
                }).catch(function(err) {console.log('error in checkIfDeletedFromAO3(): ',err)})
            
            });
        });
    }

    const checkIfDeleted = (fanfic) =>{
        // console.log('checkIfDeleted: '+fanfic.FanficID)
        let url = fanfic.URL;
        return new Promise(function(resolve, reject) {
            request.get({url,jar: jar,credentials: 'include'}, async function (err, httpResponse, body) {
                try {
                    func.delay(2000).then(async () => {
                        if(httpResponse===undefined || httpResponse.body===undefined){
                            console.log('httpResponse:',httpResponse)
                            reject(console.log(clc.red('Error in checkIfDeleted: body undefined: ',fanfic.FanficID,' url: ',fanfic.URL)))
                        }else{
                            let $ = cheerio.load(httpResponse.body);
                            if(err){
                                reject(console.log(clc.red('Error in checkIfDeleted: ',err)))
                            }else{
                                if($('#main h2').text().includes("Error 404")){
                                    console.log(clc.redBright(`Found new deleted fanfic:: ${fanfic.FanficTitle}`))    
                                    gotDeletedList.push(fanfic);
                                }
                                resolve();         
                            } 
                        }
                    })         
                }catch (error) {
                    console.log('error in checkIfDeleted:',error)// handle error
                  } 
               
       
            });
        });
    }    

    for(i=0; i<loop; i++){
        skip = (i===0) ? 0 : ((limit*i)-i+1)        
        await func.delay(3000).then(async () => await promises2.push(findNextBunchOfFanfics()))  
    }
    return await Promise.all(promises2).then(async () => {
        await gotDeletedList.forEach(async function(fanfic, index) {
            fanfic.LastUpdateOfNote=new Date().getTime();
            // console.log(`${fanfic.FanficTitle} got deleted`)
            mongoose.dbFanfics.collection('deletedFanfics').findOne({FanficID: fanfic.FanficID }, async function(err, dbFanfic) {
                err && console.log(clc.red('error in findNextBunchOfFanfics(): ',err))
                let isExist = (dbFanfic===null) ? false : true;
                if(!isExist){     
                    console.log(clc.redBright(`inserting: ${fanfic.FanficTitle}`))
                    newDeletedCounter++                          
                    await mongoose.dbFanfics.collection(fandomName).updateOne({ 'FanficID': fanfic.FanficID},{$set: {Deleted:true}})
                    await mongoose.dbFanfics.collection('deletedFanfics').insertOne(fanfic)
                }else{
                    console.log('Duplicate fanfic, ignored and moving on')
                }
            })                                  
            // }).catch(function(err) {err.code === 11000 ? console.log('Duplicate fanfic, ignored and moving on',err) : console.log('error in insert fanfic:',err)})                                   
        })
    }).then(async res=>{
        console.log('promise all')
        // DeletedCounter.push(await mongoose.dbFanfics.collection(fandomName).countDocuments({Deleted:true}))
        FandomModal.updateOne({ 'FandomName': fandomName },{ $set: { 'DeletedFanfics':gotDeletedList.length}},(err, result) => {(err) ? console.log('error:',err) : console.log('update deleted!')});
        DeletedCounter.push(gotDeletedList.length)
        DeletedCounter.push(newDeletedCounter)
        return DeletedCounter
    }).catch(error => console.log(clc.red('Error in checkIfDeletedFromAO3()',error)));
    

}


exports.loginToAO3 = async (fandomName)=>{
    console.log(clc.bgGreenBright('[ao3 controller] loginToAO3()'));
    let url = "https://archiveofourown.org/users/login/",utf8='',authenticity_token='',isLogin = false;
    return new Promise(async function(resolve, reject) {
        request.get({
            url: url,
            jar: jar,
            credentials: 'include'
        }, async function (err, httpResponse, body) {
            err && reject(err)
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
                    err && reject(err)
                    let $ = cheerio.load(body);
                    isLogin = await ($('#greeting').length > 0) ? true : false
                    isLogin ? console.log(clc.green('logged in successfully to ao3')) : console.log(clc.red('Error in Loggging in'))
                    resolve()
                })   
            ):resolve(console.log(clc.green('you are already logged in to ao3'))) 
        })
    });
}
const downloader = (url, filename) => {
    return new Promise((resolve, reject) => {
        // console.log('url:',url)
        // console.log('filename:',filename)
        request.head({url,jar, credentials: 'include'}, function (err, httpResponse, body) {
            if (err){
                reject(console.log('There was an error in: downloader(): ',err))
            }
            
            request({url,jar, credentials: 'include'}).pipe(fs.createWriteStream(filename))
            .on( "finish", () => resolve(0) )
            .on('close', () =>  {})
            .on('error',() => reject(console.log('There was an error in: downloader(): '+url+' , filename: ',+filename)))        
        }); 
    })
}; 
exports.saveFanficsToServer = async (fandom,method) =>{

    let promises =[],slowMode;

    const {FandomName,SaveMethod,SavedFanficsLastUpdate} = fandom; let fanficsList=[];
    let saveType = (SaveMethod==='') ? method+',' : SaveMethod;

    // await this.loginToAO3()
    let fanficsCount = await mongoose.dbFanfics.collection(FandomName).countDocuments({});
    if (fanficsCount==0){
        let getData = await this.getFanficsOfFandom(fandom,method)
        return getData
    }else{
        fanficsList = await getFanficsToSave(FandomName);
        if(fanficsList.length===0){
            return [0,0]
        }
        // console.log('fanficsList:',fanficsList)
        //TODO: CHECK/ADD WHICH TYPE  IS SAVED IF NOT AUTO DOWNLOAD 
        slowMode = SavedFanficsLastUpdate===undefined ? true : false;
        if(fanficsList.length>0){
            await fanficsList.map(async (url) => promises.push(saveFanficToServerHandler(url,FandomName,saveType,slowMode)))
            return await Promise.all(promises).then(fanfics => {
                fanfics.map(async fanficInfo=>{
                    await mongoose.dbFanfics.collection(FandomName).updateOne({'FanficID': Number(fanficInfo[0])},{$set: {fileName:fanficInfo[1],SavedFic:true,NeedToSaveFlag:false}},(err, result) => {if (err) {throw err}})
                })
                FandomModal.updateOne({ 'FandomName': FandomName },{ $set: {'SavedFanficsLastUpdate':new Date().getTime()}},(err, result) => {if (err) {throw err} else {console.log('all saved!')}})        
                
            })
        }   
    }
}



//UTILITIES FOR getFanficsOfFandom()
const saveFanficToServerHandler = async (url,fandomName,saveMethod,savedNotAuto)=>{
    try {
        let links = [],methods=[];
        let fanficId = 0
        let filename = '';
        url = url + '?view_adult=true';
        saveMethods = (saveMethod!== ''||saveMethod||null||saveMethod.length>0) ? saveMethod : savedNotAuto;
        (!saveMethods.includes(",")) ? methods.push(saveMethods) : methods = saveMethods.split(',');
        return await new Promise(async function(resolve, reject) {
            let urlBody = await getUrlBodyFromAo3(url);
            let $ = cheerio.load(urlBody);
            await Promise.all(
                await methods.map(async (method) => {
                    let link = await $(`.download ul li a:contains("${method.toUpperCase()}")`).attr('href');
                    //\/downloads\/(.*)\/(.*)(\..*)\?.*
                    // let fanficName = await link.replace(/\/downloads\/(.*)\/(.*)\?.*/g, "$2").replace(/%20/g,' ');
                    let fanficName = await $('div#workskin h2').first().text().trim().replace(/[^\w ]/g, '');
                    //let authorName = await $('div#workskin h3').text().replace(/\s+/g," ");
                    let authorName = await ($('div#workskin h3').first().text().replace(/\s+/g," "))==='Anonymous' ? 'Anonymous' :  $('div#workskin h3 a').first().text().replace(/\s+/g," ");
                    authorName = (authorName==='') ? 'Anonymous' : authorName;
                    fanficId = await link.replace(/\/downloads\/(.*)\/.*/, "$1");
                    let fanficNewName= `${authorName}_${fanficName} (${fanficId}).${method}` 
                    filename = `${authorName}_${fanficName} (${fanficId})`
                    await links.push([`https://archiveofourown.org${link}`,fanficNewName])                 
                })
            ).then(()=>{
                Promise.all(links.map(x => downloader(x[0], `${fanficsPath}/${fandomName}/fanfics/${x[1]}`))).then(res => {
                    let counter = res.reduce((a, b) => a + b, 0);
                    // console.log('counter:',counter)
                    if(counter===0){
                        resolve([fanficId,filename,saveMethods])
                    }else{
                        resolve([-1,null,null])
                    }
                })
            }).catch(error=>{reject(console.log(clc.red('Error in saveFanficToServerHandler(): URL: '+url+'filename: '+filename)))})
        })
    } catch (error) {
        console.log('there is an error in: saveFanficToServerHandler()',error)
    }
}
const getFanficsToSave = async (fandomName) =>{
    console.log(clc.bgGreenBright('[ao3 controller] getFanficsToSave()'));  
    console.log('fandomName',fandomName);  
    return new Promise(async function(resolve, reject) {
        filtered = []
        await mongoose.dbFanfics.collection(fandomName).find({$or: [{SavedFic:false},{NeedToSaveFlag:true}]}).toArray(async function(err, fanficsList) {
            if (err) { 
                return reject(red.clc('error in getFanficsToSave(): ',err))
            }
            filtered = []
            fanficsList.map(fanfic => {filtered.push(fanfic.URL)})
            // console.log('filtered:',filtered)
            resolve(filtered)
        });
    });
}

const getPagesOfFandomData = async (url,numberOfPages) => {
    let pages = [], promises = [];
    await [...Array(Number(numberOfPages))].forEach(async (num,index) => {promises.push(
        new Promise(async(resolve, reject) => {
            request.get({url: `${url}?page=${index+1}`,jar: jar, credentials: 'include'}, async function (err, httpResponse, body) {
                err && reject(console.log(clc.red('error in getPagesOfFandomData(): ',err)))
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
                console.log(clc.red('Error in getUrlBodyFromAo3()',err))          
                console.log(clc.red('URL:',url))          
                reject(false)
            }else{
                resolve(body)
            }        
        });
    });
}
//UTILITIES FOR getDataFromAO3FandomPage()

const saveFanficToDB = (fandomName,fanfic) =>{
    // console.log(clc.bgGreenBright('[ao3 controller] saveFanfficToDB()',fanfic));  
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
