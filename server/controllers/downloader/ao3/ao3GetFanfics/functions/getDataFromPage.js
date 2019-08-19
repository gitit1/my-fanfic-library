const clc = require("cli-color");
const mongoose = require('../../../../../config/mongoose');

const moment = require('moment');

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});


const {getPublishDate} = require('./getPublishDate');
const {saveFanficToServerHandler} = require('../../helpers/saveFanficsToServer');
const {saveFanficToDB} = require('../../../helpers/saveFanficToDB');

exports.getDataFromPage = async (page,fandomName,savedFanficsLastUpdate,autoSave,saveMethod,savedNotAuto) =>{
    //console.log(clc.blueBright('[ao3 controller] getDataFromPage()'));  
    let fanfic = {}
    let counter = -1
    let oldFanficData = false
    let updated = false;
    let newFic = false;
    let fandom = null;
    let todayDate = new Date();

    fanfic["LastUpdateOfNote"]      =       todayDate.getTime();

    fanfic["FandomName"]            =       fandomName;
    fanfic["Source"]                =       'AO3';
    fanfic["FanficID"]              =       Number(page.attr('id').replace('work_',''));

    // log.info('FanficID:',fanfic["FanficID"]);

    fanficUpdateDate                =       page.find('p.datetime').text();
    fanfic["LastUpdateOfFic"]       =       fanficUpdateDate ==="" ? 0 : new Date(fanficUpdateDate).getTime();
    if(fanficUpdateDate ===""){
        console.log(clc.red('ERROR IN FANFIC DATE:',fanfic["FanficID"]))
    }

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
        
        let isThisWeekOldData =  moment(new Date(oldFanficData.LastUpdateOfFic)).isSame(new Date(), 'week')
        
        updated =   (fanfic["FanficTitle"] !== oldFanficData.FanficTitle) || 
                    (fanfic["LastUpdateOfNote"] > oldFanficData.LastUpdateOfNote) ||
                    (fanfic["NumberOfChapters"] > oldFanficData.NumberOfChapters) ? true : false;
        
        newFic = (fandom===null) ? true : false
        updated = isThisWeekOldData ? false : updated

        newFic      &&    console.log(`New Fanfic: ${fanfic["FanficTitle"]} - Saving into the DB`);
        updated     &&    console.log(`Updated Fanfic - ${fanfic["FanficTitle"]} - Saving into the DB`);

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
    // }else if(newFic || updated ||savedFanficsLastUpdate===undefined){
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