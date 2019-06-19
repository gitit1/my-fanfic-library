const clc = require("cli-color");
const axios = require('axios');
const cheerio = require('cheerio');

const mongoose = require('../config/mongoose');
const FandomModal = require('../models/Fandom');
const FanficModal = require('../models/Fanfic');

const func = require('../helpers/functions');

exports.getFanficsOfFandom =  async (fandom) => {
   console.log(clc.blue('[ao3 controller] getFanficsOfFandom()'));

   const {FandomName,SearchKeys} = fandom;

   let fandomUrlName = SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
   const ao3URL = `https://archiveofourown.org/tags/${fandomUrlName}/works`;
   
   let numberOfPages = 0; let works = []; let promises = [];

   const html = await axios.get(ao3URL).then(res => res.data).catch(err => console.log('Error in get ao3URL',err));
 
   const getPagesOfFandomData = async numberOfPages => {
       return new Promise(async(resolve, reject) => {
           //get user list from our db:
           let pages = [];
           [...Array(Number(numberOfPages))].forEach(async (num,index) => {promises.push(axios.get(`${ao3URL}?page=${index+1}`))});

           axios.all(promises).then(function(results) {
               results.forEach(function(response) {
                  pages.push(response.data)
               })
               promises = [];
               resolve(pages)
           });
           
       });
   }

   if(html){
       let $ = cheerio.load(html);
       
       if(Number($('#main').find('ol.pagination li').eq(-2).text())===0){
           numberOfPages = 1
       }else if(Number($('#main').find('ol.pagination li').eq(-2).text())>=10){
           numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text())+1;
       }else{
           numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text());
       }

       let pagesArray = await getPagesOfFandomData(numberOfPages);

       await pagesArray.map(page => promises.push(   
         func.delay(3000).then(() => getDataFromAO3FandomPage(page,FandomName))             
       ))


      await Promise.all(promises);

   }

   
   let FanficsInFandom = await mongoose.dbFanfics.collection(FandomName).countDocuments();
   let CompleteFanfics = await mongoose.dbFanfics.collection(FandomName).countDocuments({'Complete':true});
   let OnGoingFanfics =  FanficsInFandom-CompleteFanfics;

   await FandomModal.updateOne({ 'FandomName': FandomName },
                                { $set: { 'FanficsInFandom':FanficsInFandom, 
                                          'CompleteFanfics':CompleteFanfics, 
                                          'OnGoingFanfics':OnGoingFanfics,
                                          'FanficsLastUpdate':new Date().getTime()}},
       (err, result) => {
           if (err) throw err;
           console.log('Fandom updateded');
        }
    )


   return


}

const getDataFromAO3FandomPage =  async (page,FandomName) => {
   console.log(clc.blue('[ao3 controller] getDataFromAO3FandomPage()'));

   let $ = cheerio.load(page);
   let fanficData = [];

   await $('ol.work').children('li').each(async function () {
       let fanfic = {}
       let oldFanficData = false
       
       fanfic["FanficID"]         = Number($(this).attr('id').replace('work_',''));

      let fandom = await mongoose.dbFanfics.collection(FandomName).findOne({FanficID: fanfic["FanficID"]})
      fandom!==null && (oldFanficData = fandom)

       fanfic["LastUpdateOfNote"]      =       new Date().getTime();
       fanfic["Favorite"]              =       oldFanficData ? oldFanficData.Favorite : false;         
       fanfic["Status"]                =       oldFanficData ? oldFanficData.Status : "Need To Read";
       fanfic["ChapterStatus"]         =       oldFanficData ? oldFanficData.ChapterStatus : 0;
       fanfic["SavedFic"]              =       oldFanficData ? oldFanficData.SavedFic : false;

       fanfic["FanficTitle"]           =       $(this).find('div.header h4 a').first().text();
       fanfic["URL"]                   =       'https://archiveofourown.org'+ $(this).find('div.header h4 a').first().attr('href');
       fanfic["Author"]                =       $(this).find('div.header h4 a').last().text();
       fanfic["AuthorURL"]             =       'https://archiveofourown.org'+ $(this).find('div.header h4 a').last().attr('href');
       fanfic["LastUpdateOfFic"]       =       $(this).find('p.datetime').text() ==="" ? 0 : new Date($(this).find('p.datetime').text()).getTime();
       fanfic["Rating"]                =       $(this).find('span.rating span').text();
       let tags                        =       [];
       let warnings                    =       [];
       let relationships               =       [];
       let characters                  =       [];
       let freeforms                   =       [];
       $(this).find('ul.tags').children('li').each(function () {
           if($(this).attr('class')=='warnings'){
               warnings.push($(this).text())
           }else if($(this).attr('class')=='relationships'){
               relationships.push($(this).first().text())
           }else if($(this).attr('class')=='characters'){
               characters.push($(this).first().text())
           }else if($(this).attr('class')=='freeforms'){
               freeforms.push($(this).first().text())
           }               
       });
       tags.push({'warnings':warnings},{'relationships':relationships},{'characters':characters},{'freeforms':freeforms})                       
       fanfic["Tags"]                  =       tags;
       fanfic["Description"]           =       $(this).find('blockquote.summary').text();
       fanfic["Hits"]                  =       $(this).find('dd.hits').text() ===""  ? 0 : Number($(this).find('dd.hits').text());
       fanfic["Kudos"]                 =       $(this).find('dd.kudos').text() ==="" ? 0 : Number($(this).find('dd.kudos').text()); 
       fanfic["Language"]              =       $(this).find('dd.language').text()  
       fanfic["Comments"]              =       ($(this).find('dd.comments').text()) ==="" ? 0 : Number($(this).find('dd.comments').text()); 
       fanfic["Words"]                 =       $(this).find('dd.words').text(); 
       fanfic["NumberOfChapters"]      =       Number($(this).find('dd.chapters').text().split('/')[0]);  

       chapCurrent = $(this).find('dd.chapters').text().split('/')[0]
       chapEnd = $(this).find('dd.chapters').text().split('/')[1]
       fanfic["Complete"] = (String(chapEnd) !== '?' && (Number(chapCurrent)===Number(chapEnd)) ) ? true : false

       fanfic["Image"]             = "";
       

       //fanficData.push(fanfic);
       
       //const fanficRecord = new Fanfics({'FandomName':FandomName,'Fanfics':fanfics});
       await mongoose.dbFanfics.collection(FandomName).findOne({FanficID: fanfic["FanficID"] }, async function(err, dbFanfic) {
         if (err) { console.log('err: ',err)}
         let isExist = (dbFanfic===null) ? false : true;
         if(!isExist){
            await mongoose.dbFanfics.collection(FandomName).insertOne(fanfic);
         }else{ 
            await mongoose.dbFanfics.collection(FandomName).updateOne({ 'FanficID': fanfic["FanficID"]},{$set: fanfic})
         }

       });

   })


return null
}