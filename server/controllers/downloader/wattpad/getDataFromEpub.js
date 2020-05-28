const clc = require("cli-color");
const fs = require('fs');
let EPub = require("epub");
const cheerio = require('cheerio');

const { saveFanficToDB } = require('../helpers/functions/saveFanficToDB');
const { getUrlBodyFromSite } = require('../ff/helpers/getUrlBodyFromSite');
const { fixStringForPath } = require('../../helpers/fixStringForPath');
const { getDataFromWattpadEpub } = require('../fileReader/epub/helpers/getDataFromWattpadEpub')
const Path = require('path');

exports.getDataFromEpub = (log, fandomName, paths) => {
    console.log(clc.greenBright('[WPD] getPaths()'));
    return new Promise(async function (resolve, reject) {
        await getEpubMetadata(log, fandomName, paths);
        resolve();
    })
}

const saveFileToServer = (oldPath, newPath) => {
    console.log(clc.blue('[WPD] saveFileToServer()'));

    return new Promise(async function (resolve, reject) {
        fs.rename(oldPath, newPath, (err) => {
            if (err) { reject(console.log('saveFileToServer err:', err)) }
            resolve(true)
        });
    }).catch((error) => {
        return false;
    });
}

const deleteFolderRecursive = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const getEpubMetadata = (log, fandomName, paths) => {
    console.log(clc.blue('[WPD] getEpubMetadata()'));

    return new Promise(async function (resolve, reject) {
        let epubfile = paths[1];
        let fanfic = {}
        let epub = new EPub(epubfile, '/images/', '/links/');
        epub.on("end", function () {
            epub.getChapter("title_page", async function (err, text) {
                const isComplete = $('div').html().split(/<br *\/?>/i)[3].split('</b> ')[1] === 'Complete' ? true : false;
                if (isComplete) {
                    getDataFromWattpadEpub(fandomName, text, false)

                    let oldPdfPath      = epubfile.replace('epub','pdf');
                    let fanficNaming    = fixStringForPath(`${fanfic.Author}_${fanfic.FanficTitle} (${fanfic.FanficID})`);
                    let newFanficPath   = `public/fandoms/${fanfic.FandomName}/fanfics/${fanficNaming}.epub`;
                    let imageNewPath    =  `public/fandoms/${fanfic.FandomName}/fanficsImages/${fanficNaming}.jpg`;
                    let newPdfPath      = `public/fandoms/${fanfic.FandomName}/fanfics/${fanficNaming}.pdf`;

                    let pdfSaved = await saveFileToServer(oldPdfPath, newPdfPath);
                    let epubSaved = await  saveFileToServer(epubfile, newFanficPath);
                    let imageSaved = await saveFileToServer(`${paths[0]}/cover.jpg`, imageNewPath);

                    if(pdfSaved || epubSaved){
                        fanfic.SavedFic = true;
                        fanfic.savedAs = epubSaved && pdfSaved ? 'epub,pdf' : epubSaved ? 'epub' : 'pdf';
                        fanfic.fileName = fanficNaming;
                        fanfic.NeedToSaveFlag = false;
                        deleteFolderRecursive(paths[0])
                    }else{
                        fanfic.SavedFic = false;
                        fanfic.NeedToSaveFlag = true;
                    }

                    fanfic.image = imageSaved &&  `${fanficNaming}.jpg`;
                    await saveFanficToDB(fandomName,fanfic);
                }
                resolve();
            });
        });
        epub.parse();
    });

}