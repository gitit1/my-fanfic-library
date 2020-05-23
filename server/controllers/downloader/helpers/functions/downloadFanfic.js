const fs = require('fs');
const puppeteer = require('puppeteer');
let request = require('request');

const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

let jar = request.jar();
request = request.defaults({ jar: jar, followAllRedirects: true });

const { fixStringForPath } = require('../../../helpers/fixStringForPath.js');
const fanficsPath = "public/fandoms";

exports.downloadFanfic = async (url, source, fileName, savedAs, fandomName, fanficId, collection) => {
    fileName = fixStringForPath(fileName);
    let fullFilename = `${fanficsPath}/${fandomName.toLowerCase()}/fanfics/${fileName}.${savedAs}`
    let sourceCode = (source === 'FF') ? 'ffnet' : null
    const collectionName = (collection && collection !== '') ? collection : fandomName;
    const browser = await puppeteer.launch(
        {
        ignoreHTTPSErrors: true,
        args :[
          '--ignore-certificate-errors',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--lang=ja,en-US;q=0.9,en;q=0.8',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        ]
    });
    const page = await browser.newPage();
    try {
        return await new Promise(async function (resolve, reject) {
            await page.goto('http://ff2ebook.com/');
            await page.waitFor('body')
            // await page.screenshot({ path: 'example.png' });
            await page.focus('#fic-input-form input')
            await page.keyboard.type(url)
            await page.click('#fic-input-submit')
            // console.log('url:', url)
        
            setTimeout(async () => {
                url = `http://ff2ebook.com/download.php?source=${sourceCode}&id=${fanficId}&filetype=${savedAs}`
                    console.log('downloadFanfic - fileName:', fullFilename)
                    console.log('url:', url)
                    const file = fs.createWriteStream(fullFilename);
                    request({ url, jar, credentials: 'include' }).pipe(file);
    
                    file.on('finish', () => {
                        console.log('finished stramimg file')
                    }).on('close', async () => {
                        fs.readFileSync(fullFilename, 'utf8');
                        console.log('closed straming');
                        await updateSavedFandomData(fandomName, source, fanficId, fileName, savedAs, collectionName);
                        resolve(0);
                    }).on('error', () =>
                        reject(console.log(`There was an error in: downloader(): ${url} , filename: ${fullFilename}`)
                        )).on('timeout', async function (e) {
                            console.log(`TimeOut - redownloading: ${url}`)
                            downloadFanfic(source, fileName, savedAs, fandomName);
                        });                   
            }, 20000);
        });
    } catch (error) {
        console.log('error in download file:',error);
        unsavedFanficDBdata()
    } finally{
        console.log('downloadFanfic::: Finally close connection');
        await page.close();
        await browser.close();
    }
}

const updateSavedFandomData = async (fandomName, source, fanficId, fileName, savedAs, collectionName) => {
    console.log('updateSavedFandomData::: collection: ',collectionName, ' id: ',fanficId);
    await savedFanficDBdata(collectionName, fanficId, fileName, savedAs);
    await savedFandomDBdata(fandomName, source, collectionName);
    return null;
}

const savedFanficDBdata = (collectionName, fanficId, filename, savedAs) => {
    console.log('savedFanficDBdata')
    return new Promise(function (resolve, reject) {
        mongoose.dbFanfics.collection(collectionName)
            .updateOne({ 'FanficID': fanficId }, { $set: { 'SavedFic': true, 'NeedToSaveFlag': false, 'fileName': filename, 'savedAs': savedAs } }
                , function (error, result) {
                    error && reject(error);
                    resolve(result)
                })
    });
}
const unsavedFanficDBdata = (collectionName, fanficId, filename, savedAs) => {
    console.log('unsavedFanficDBdata')
    return new Promise(function (resolve, reject) {
        mongoose.dbFanfics.collection(collectionName)
            .updateOne({ 'FanficID': fanficId }, { $set: { 'SavedFic': false, 'NeedToSaveFlag': true, 'fileName': filename, 'savedAs': savedAs } }
                , function (error, result) {
                    error && reject(error);
                    resolve(result)
                })
    });
}
const savedFandomDBdata = async (fandomName, source, collectionName) => {
    console.log('savedFandomDBdata')
    const attr = (source === 'AO3') ? 'AO3.SavedFanfics' : (source === 'FF') ? 'FF.SavedFanfics' : 'Wattpad';
    const savedNum = await mongoose.dbFanfics.collection(collectionName).countDocuments({ 'Source': source, 'SavedFic': true })

    return new Promise(function (resolve, reject) {
        FandomModal.updateOne({ 'FandomName': fandomName }, { $set: { [attr]: savedNum } }, (error, result) => {
            error && reject(error);
            resolve(result)
        });
    });
}
//http://ff2ebook.com/download.php?source=ffnet&id=13198013&filetype=epub