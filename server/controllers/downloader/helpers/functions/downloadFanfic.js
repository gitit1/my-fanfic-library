const fs = require('fs');
const puppeteer = require('puppeteer');
let request = require('request');

const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

let jar = request.jar();
request = request.defaults({ jar: jar, followAllRedirects: true });

const { fixStringForPath } = require('../../../helpers/fixStringForPath.js');
const fanficsPath = "public/fandoms";

exports.downloadFanfic = async (url, source, fileName, savedAs, fandomName, fanficId, Collection) => {
    fileName = fixStringForPath(fileName);
    let fullFilename = `${fanficsPath}/${fandomName.toLowerCase()}/fanfics/${fileName}.${savedAs}`
    let sourceCode = (source === 'FF') ? 'ffnet' : null
    const collectionName = (Collection && Collection !== '') ? Collection : fandomName;
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();
    await page.goto('http://ff2ebook.com/');
    await page.screenshot({ path: 'example.png' });
    await page.focus('#fic-input-form input')
    await page.keyboard.type(url)
    await page.click('#fic-input-submit')
    console.log('url:', url)

    return new Promise(function (resolve, reject) {
        setTimeout(async () => {
            url = `http://ff2ebook.com/download.php?source=${sourceCode}&id=${fanficId}&filetype=${savedAs}`
            // return await new Promise(async (resolve, reject) => {
                console.log('downloadFanfic - fileName:', fullFilename)
                console.log('url:', url)
                const file = fs.createWriteStream(fullFilename);
                request({ url, jar, credentials: 'include' }).pipe(file);

                file.on('finish', () => {
                    // page.close();
                    // browser.close();
                    // resolve(0)
                    console.log('finished')
                }).on('close', () => {
                    fs.readFileSync(fullFilename, 'utf8');
                    // page.close();
                    // browser.close();
                    console.log('closed')
                }).on('error', () =>
                    reject(console.log(`There was an error in: downloader(): ${url} , filename: ${fullFilename}`)
                    )).on('timeout', async function (e) {
                        console.log(`TimeOut - redownloading: ${url}`)
                        downloadFanfic(source, fileName, savedAs, fandomName);
                    });
                await updateSavedFandomData(fandomName, source, fanficId, fileName, savedAs, collectionName)
                resolve(0);
            // });
        }, 15000);
    });
}

const updateSavedFandomData = async (fandomName, source, fanficId, fileName, savedAs, collectionName) => {
    console.log('updateSavedFandomData')
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