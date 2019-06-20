const clc = require("cli-color");
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('../config/mongoose');
const FandomModal = require('../models/Fandom');

const func = require('../helpers/functions');

let request = require('request')
var FormData = require('form-data')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});

exports.getFanficsOfFandom =  async (fandom) => {
   console.log(clc.blue('[ao3 controller] getFanficsOfFandom()'));

   const {FandomName,SearchKeys} = fandom;
  
   await this.connectToAO3()
   
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
            func.delay(3000).then(async () => await getDataFromAO3FandomPage(page,FandomName))             
        ))

        const reflect = p => p.then(v => ({v, status: "fulfilled" }),
        e => ({e, status: "rejected" }));

        await Promise.all(promises.map(reflect)).then(async () => {
            console.log('FanficsInFandom: ',await mongoose.dbFanfics.collection(FandomName).countDocuments({}))
            let FanficsInFandom = await mongoose.dbFanfics.collection(FandomName).countDocuments({});
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
             return FanficsInFandom
         
          })

   }


   


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


//NOT WORKING FOR NOW:

//exports.connectToAO3 = async (fandom) =>{
exports.connectToAO3 = async (req,res) =>{
    let username = "danidin307",
    password = "danidin307danidin307danidin307",
    url = "https://archiveofourown.org/users/login/";
    authenticity_token = ""
    utf8 = ""

    // const html = await axios.get(url).then(res => res.data).catch(err => console.log('Error in get ao3URL',err));
    

    // let $ = cheerio.load(html);
    // authenticity_token  = await $('#new_user').find("input[name = 'authenticity_token']").attr('value')
    // utf8                = await $('#new_user').find("input[name = 'utf8']").attr('value')

    // var form = new FormData();
    // form.append('utf8', utf8);
    // form.append('authenticity_token', authenticity_token);
    // form.append('user[login]', username);
    // form.append('user[password]', password);
    // form.append('user[remember_me]', 0);
    // form.append('commit', 'Log in');

    let test = encodeURI('utf8='+utf8+'authenticity_token='+authenticity_token+'user[login]='+username+'user[password]='+password+'user[remember_me]='+0+'commit'+'Log in')
    
    // var request = require('request')
    request.get({
        url: url,
        jar: jar,
        credentials: 'include'
    }, async function (err, httpResponse, body) {
            let $ = cheerio.load(body);
            authenticity_token  = await $('#new_user').find("input[name = 'authenticity_token']").attr('value')
            utf8                = await $('#new_user').find("input[name = 'utf8']").attr('value')
        var details = {
            'utf8': utf8,
            'authenticity_token': authenticity_token,
            'user[login]': username,
            'user[password]':password,
            'user[remember_me]':0,
            'commit':'Log in'
    };
    const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

    // formBody.append("utf8", utf8);
    // formBody.append("user[login]", username);
    // formBody.append("user[password]", authenticity_token);
    // formBody.append("user[remember_me]", 0);
    // formBody.append("commit", "Log in");
    request({
            url,
            method: 'POST',
            body: formBody,
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            },
            jar: jar,
            credentials: 'include',
        }, function (err, httpResponse, body) { res.send(body)})      
     })
    //     let $ = cheerio.load(body);
    //     authenticity_token  = await $('#new_user').find("input[name = 'authenticity_token']").attr('value')
    //     utf8                = await $('#new_user').find("input[name = 'utf8']").attr('value')
    //     request.post({
    //     url: url,
    //     credentials: 'include',
    //     headers:{ 
    //         "authority": "archiveofourown.org",
    //         "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    //         "accept-encoding": "gzip, deflate, br",
    //         "content-type": "application/x-www-form-urlencoded",
    //         "origin": "https://archiveofourown.org",
    //         "referer": "https://archiveofourown.org/users/login",
    //         "upgrade-insecure-requests": "1",
    //         "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36",
    //         "scheme": "https"
    //     },
    //     formData: {
    //         'utf8': utf8,
    //         'authenticity_token': authenticity_token,
    //         'user[login]': authenticity_token,
    //         'user[password]':password,
    //         'user[remember_me]':0,
    //         'commit':'Log in'
    //     }
    //     // body:form
    //   }, function (err, httpResponse, body) { res.send(body)})
    // })


    //   request.post({
    //     url: url,
    //     headers:{ 
    //         "authority": "archiveofourown.org",
    //         "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    //         "accept-encoding": "gzip, deflate, br",
    //         "content-type": "application/x-www-form-urlencoded",
    //         "origin": "https://archiveofourown.org",
    //         "referer": "https://archiveofourown.org/users/login",
    //         "upgrade-insecure-requests": "1",
    //         "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36",
    //         "scheme": "https"
    //     },
    //     // form: {
    //     //     'utf8': utf8,
    //     //     'authenticity_token': authenticity_token,
    //     //     'user[login]': authenticity_token,
    //     //     'user[password]':password,
    //     //     'user[remember_me]':0,
    //     //     'commit':'Log in'
    //     // }
    //     body:form
    //   }, function (err, httpResponse, body) { res.send(httpResponse.body)})
    
    // res.send(test)

    // //do something in the chain to go to your desired page.
    // .evaluate(() => document.querySelector('body').outerHTML)
    // .then(function (html) {
    //     cheerio.load(html);
    //     // do something 
    // })
    // .catch(function (error) {
    // console.error('Error:', error);
    // });
    // res.send(form)
//     var options = {
//         url: url,
//         // form:{'utf8':utf8,'authenticity_token':authenticity_token,'user[login]':username,'user[password]':password,'user[remember_me]':0,'commit':'Log in'},
//         formData:test,
//         headers:{ 
//             "authority": "archiveofourown.org",
//             "path": "/users/login",
//             "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
//             "accept-encoding": "gzip, deflate, br",
//             "content-type": "application/x-www-form-urlencoded",
//             "origin": "https://archiveofourown.org",
//             "referer": "https://archiveofourown.org/users/login",
//             "upgrade-insecure-requests": "1",
//             "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36",
//             "scheme": "https",
// }
//       }
//     request.post(options, function (err, resp, body) {
//         if (err) {
//           console.dir(err)
//           return;
//         }
//         // parse method is optional
//         return res.send(body);
//       });

    // let data = new FormData();

    // data.append('user[login]',username)
    // data.append('user[password]',password)
    // auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

    // request.post({url:url, form: {'user[login]':username,'user[password]':password}})
    // return
    // request.post({url:url, form: {'user[login]':username,'user[password]':password}}, function(err,httpResponse,body){
    //      res.send(body)
    // })
    // axios.post(url, data, {withCredentials: true} , {headers:{"scheme": "https",
    //                                                           "authority": "archiveofourown.org",
    //                                                           "path": "/users/login",
    //                                                           "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    //                                                           "content-type": "application/x-www-form-urlencoded",
    //                                                           "origin": "https://archiveofourown.org",
    //                                                           "referer": "https://archiveofourown.org/users/login",
    //                                                           "upgrade-insecure-requests": "1",
    //                                                           "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36",
    //                                                          }}).then(response=>{
    //     res.send(response.data)
    // })
    // request.post({
    //                 url:url, 
    //                 form: {'login':username,'password':password,'authenticity_token':'YUCSRwjNXOGy33pg/WvDHLtn50sM9XVdmYGDFaRJaL87ZGb5WeJFo81Gr+PQER9R22mdtDB8Fv/qZacllBADxw=='},
    //                 headers: { 'content-type': 'application/x-www-form-urlencoded',
    //                            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36",

    //                          },
    //                 jar: jar,
    //                 credentials: 'include',
    //             },function(err,httpResponse,body){
    //      res.send(body)
    // })

}