const clc = require("cli-color");
const cheerio = require('cheerio');
const mongoose = require('../config/mongoose');

const FandomModal = require('../models/Fandom');
const FanficSchema = require('../models/Fanfic');

const fs = require('fs');
const puppeteer = require('puppeteer');

const func = require('../helpers/functions');
const ao3funcs = require('./ao3.js')
const moment = require('moment');

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});
const fanficsPath = "public/fandoms"

exports.getFanficData = async (req,res) =>{
    console.log(clc.blue('[otherFanficsSites controller] getFanficData()'));
    
    const {url,fandomName,download} = req.query;

    let fanfic = {},tags=[],freeforms =[],characters=[],relationships=[];
    const siteUrl = getSiteUrl(url)
    let isChaptersAttr = false,isGnere = false,ischaractersTags = false,isLanguage=false;

    let body = await getUrlBodyFromSite(url);
    
    let $ = cheerio.load(body);
    // console.log('url:',url)
    // console.log('text:',$('#profile_top span.xgray').text())
    $('#profile_top span.xgray').text().split(' - ').forEach(attr => {
        if(attr.includes('Rated:')){
            fanfic.Rating =  getRating($('#profile_top span.xgray a[target=rating]').text());
        }else if(attr.includes('Chapters:')){
            fanfic.NumberOfChapters = Number(attr.split(': ')[1].replace(' ',''));
            isChaptersAttr = true;
            fanfic.Oneshot = false;
        }else if(!isChaptersAttr && !isGnere && !ischaractersTags && !isLanguage){
            fanfic.Language = attr;
            isLanguage = true;
        }else if(isLanguage && !isChaptersAttr && !isGnere && !ischaractersTags){
            attr.split('/').forEach(tag => {
                freeforms.push(tag)
            });
            freeforms.length>0 && tags.push({'tags':freeforms});
            isGnere = true;
        }else if(isLanguage && !isChaptersAttr && isGnere && !ischaractersTags){
            if(attr.includes(']')){
                attr.split('] ').forEach(tag => {
                    if(tag.includes('[')||tag.includes(']')){
                        relationships.push(tag.replace('[','').replace(']','').replace(',','/'))
                    }else{
                        tag.split(',').forEach(subtag => {
                            characters.push(subtag)
                        });
                    }
                });
            }else{
                attr.split(',').forEach(tag => {
                    characters.push(tag)
                });
            }
            characters.length>0 && tags.push({'characters':characters});            
            relationships.length>0 && tags.push({'relationships':relationships});            
            ischaractersTags = true;
        }else if(attr.includes('Words:')){
            fanfic.Words = Number(attr.split(': ')[1].replace(',',''));
        }else if(attr.includes('Reviews:')){
            fanfic.Comments = Number(attr.split(': ')[1].replace(' ','').replace(',',''));
        }else if(attr.includes('Favs:')){
            fanfic.Kudos = Number(attr.split(': ')[1].replace(' ','').replace(',',''));
        }else if(attr.includes('Follows:')){
            fanfic.Bookmarks = Number(attr.split(': ')[1].replace(' ','').replace(',',''));
        }else if(attr.includes('id:')){
            fanfic.FanficID = Number(attr.split(': ')[1].replace(' ',''));
        }else if(attr.includes('Complete')){
            fanfic.Complete = true;
        }

    });
    fanfic.Description = $('#profile_top div.xcontrast_txt').html()
    if(!fanfic.Complete){
        fanfic.Complete = false;
    }
    if(!fanfic.NumberOfChapters && fanfic.Complete){
        fanfic.NumberOfChapters = 1
        fanfic.Oneshot = true
    }
    fanfic.URL                  =       url
    fanfic.Source               =       getSource(url)
    fanfic.FandomName           =       fandomName;
    fanfic.FanficTitle          =       $('#profile_top b.xcontrast_txt').first().text();
    fanfic.Author               =       $('#profile_top a.xcontrast_txt').first().text();
    fanfic.AuthorURL            =       siteUrl + $('#profile_top a.xcontrast_txt').first().attr('href');
    fanfic.LastUpdateOfFic      =       Number($('#profile_top span.xgray span').first().attr('data-xutime')+'000');
    fanfic.PublishDate          =       (fanfic.Oneshot) ? fanfic.LastUpdateOfFic : Number($('#profile_top span.xgray span').last().attr('data-xutime')+'000');
    fanfic.LastUpdateOfNote     =       new Date().getTime();
    fanfic.Tags = tags;

    // console.log('text:',text)
    // console.log('fanfic:',fanfic)
    ao3funcs.saveFanficToDBHandler(fandomName,fanfic)
    download && downloadFanfic(url,fanfic.Source,`${fanfic.Author}_${fanfic.FanficTitle} (${fanfic.FanficID})`,'epub',fanfic.FandomName,fanfic.FanficID)
    res.send(fanfic)
}

const getSource = url =>{
    return url.includes('fanfiction.net')  ? 'FF' 
         : url.includes('archiveofourown.org') ? 'AO3' 
         : url.includes('wattpad.com') ? 'wattpad' : 'Unknown';
}
const getSiteUrl = url =>{
    return url.includes('fanfiction.net')  ? 'https://www.fanfiction.net' 
         : url.includes('archiveofourown.org') ? 'https://archiveofourown.org' 
         : url.includes('wattpad.com') ? 'https://www.wattpad.com' : 'Unknown';
}
const getRating = rating =>{
    switch (rating) {
        case 'Fiction  K+':
            return 'general';
            break;
        case 'Fiction  K':
            return 'general';
            break;  
        case 'Fiction  T':
            return 'teen';
            break;
        case 'Fiction  M':
            return 'mature';
            break;               
        default:
            return 'none';
            break;
    }
}

const getUrlBodyFromSite = url =>{
    return new Promise(function(resolve, reject) {
        request.get({url,jar, credentials: 'include'}, function (err, httpResponse, body) {
            if(err){  
                console.log(clc.red('Error in getUrlBodyFromSite()',err))          
                console.log(clc.red('URL:',url))          
                reject(false)
            }else{
                // console.log('httpResponse:',httpResponse)
                resolve(httpResponse.body)
            }        
        });
    });
}

// const saveFanficToDB = fanfic =>{

// }

const downloadFanfic = async (url,source,filename,type,fandomName,id) => {
    let fullFilename = `${fanficsPath}/${fandomName.toLowerCase()}/fanfics/${filename}.${type}`
    let sourceCode = (source==='FF') ? 'ffnet' : null

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://ff2ebook.com/');
    await page.screenshot({path: 'example.png'});
    await page.focus('#fic-input-form input')
    await page.keyboard.type(url)
    await page.click('#fic-input-submit')
    console.log('url:',url)
    
    setTimeout(() => {
        url = `http://ff2ebook.com/download.php?source=${sourceCode}&id=${id}&filetype=${type}`
        new Promise((resolve, reject) => {
            console.log('filename:',fullFilename)
            console.log('url:',url)
            const file = fs.createWriteStream(fullFilename);
            request({url,jar, credentials: 'include'}).pipe(file);
    
            file.on('finish',() => {
                resolve(0)
            }).on('close',() => {
                fs.readFileSync(fullFilename, 'utf8');    
            }).on('error',() => 
                reject(console.log(`There was an error in: downloader(): ${url} , filename: ${fullFilename}`)
            )).on('timeout', function(e) {
                console.log(`TimeOut - redownloading: ${url}`)
                downloadFanfic(source,filename,type,fandomName);
            });  
        })
    }, 20000);

}
//http://ff2ebook.com/download.php?source=ffnet&id=13198013&filetype=epub
