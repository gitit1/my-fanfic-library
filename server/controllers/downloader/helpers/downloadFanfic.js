const fs = require('fs');
const puppeteer = require('puppeteer');
let request = require('request');

const mongoose = require('../../../config/mongoose');
const FandomModal = require('../../../models/Fandom');

let jar = request.jar();
request = request.defaults({jar: jar,followAllRedirects: true});

const fanficsPath = "public/fandoms";

exports.downloadFanfic = async (url,source,fileName,savedAs,fandomName,fanficId) =>{
    let fullFilename = `${fanficsPath}/${fandomName.toLowerCase()}/fanfics/${fileName}.${savedAs}`
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
        url = `http://ff2ebook.com/download.php?source=${sourceCode}&id=${fanficId}&filetype=${savedAs}`
        new Promise((resolve, reject) => {
            console.log('fileName:',fullFilename)
            console.log('url:',url)
            const file = fs.createWriteStream(fullFilename);
            request({url,jar, credentials: 'include'}).pipe(file);
    
            file.on('finish',() => {
                resolve(0)
            }).on('close',() => {
                fs.readFileSync(fullFilename, 'utf8');    
            }).on('error',() => 
                reject(console.log(`There was an error in: downloader(): ${url} , filename: ${fullFilename}`)
            )).on('timeout', async function(e) {
                console.log(`TimeOut - redownloading: ${url}`)
                downloadFanfic(source,fileName,savedAs,fandomName);
            });  
            updateSavedFandomData(fandomName,source,fanficId,fileName,savedAs)
        })
    }, 20000);
    return null;
}

const updateSavedFandomData = async (fandomName,source,fanficId,fileName,savedAs) =>{
    await savedFanficDBdata(fandomName,fanficId,fileName,savedAs);
    await savedFandomDBdata(fandomName,source);
    return null;
}

const savedFanficDBdata = (fandomName,fanficId,filename,savedAs) =>{ 
    return new Promise(function(resolve, reject) {
        mongoose.dbFanfics.collection(fandomName)
        .updateOne({'FanficID':fanficId},{$set: {'SavedFic':true,'NeedToSaveFlag':false,'fileName':filename,'savedAs':savedAs}}
        ,function (error, result) {
            error && reject(error);
            resolve(result)
        })
    });
}
const savedFandomDBdata = async (fandomName,source) =>{ 
    const attr = (source==='AO3') ? 'AO3SavedFanfics' : (source==='FF') ? 'FFSavedFanfics' : 'Wattpad';
    const savedNum = await mongoose.dbFanfics.collection(fandomName).countDocuments({'Source':source,'SavedFic':true})

    return new Promise(function(resolve, reject) {
        FandomModal.updateOne({'FandomName': fandomName},{$set: {[attr]:savedNum}},(error, result) => {
            error && reject(error);
            resolve(result)
        });
    });
}
//http://ff2ebook.com/download.php?source=ffnet&id=13198013&filetype=epub