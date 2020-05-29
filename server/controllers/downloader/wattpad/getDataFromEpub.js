const clc = require("cli-color");
const fs = require('fs');
let EPub = require("epub");
const cheerio = require('cheerio');

const { saveFanficToDB } = require('../helpers/functions/saveFanficToDB')
const { getUrlBodyFromSite } = require('../ff/helpers/getUrlBodyFromSite')
const { fixStringForPath } = require('../../helpers/fixStringForPath')
const Path = require('path');

exports.getDataFromEpub = (log, fandomName, paths) => {
    console.log(clc.greenBright('[WPD] getPaths()'));
    return new Promise(async function (resolve, reject) {
        await getEpubMetadata(log, fandomName, paths);
        resolve();
    })
}
const getRating = async (url) => {
    console.log(clc.blue('[WPD] getRating()'));
    return new Promise(async function (resolve, reject) {
        let body = await getUrlBodyFromSite(url);
        let $ = cheerio.load(body);

        if ($('span:contains(" Mature ")').text() === ' Mature ') {
            resolve('mature')
        }
        resolve('teen');
    });
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
                let $ = cheerio.load(text);
                let tags = [], freeforms = [];
                fanfic.Complete = $('div').html().split(/<br *\/?>/i)[3].split('</b> ')[1] === 'Complete' ? true : false;
                if (fanfic.Complete) {
                    fanfic.Author = epub.metadata.creator;
                    fanfic.FanficTitle = epub.metadata.title;
                    fanfic.FanficID = $('h3 a').first().attr('href').split('/story/')[1];
                    fanfic.FandomName = fandomName;
                    fanfic.URL = $('h3 a').first().attr('href');

                    for (let index = 0; index < 15; index++) {
                        const attr = $('div').html().split(/<br *\/?>/i)[index];
                        if (attr === undefined) { break }
                        const rawValue = attr.split('</b> ')[1]
                        if (attr.includes("Chapters")) {
                            fanfic.NumberOfChapters = Number(rawValue);
                        }
                        if (attr.includes("Genre")) {
                            rawValue.split(',').forEach(tag => {
                                freeforms.push(tag)
                            });
                        }
                        if (attr.includes("Read Count")) { fanfic.Hits = parseFloat(rawValue.split(',').join('')); }
                        if (attr.includes("Words")) { fanfic.Words = parseFloat(rawValue.split(',').join('')); }
                        if (attr.includes("Summary")) { fanfic.Description = rawValue; }
                        if (attr.includes("Published")) { fanfic.PublishDate = new Date(rawValue).getTime(); }
                        if (attr.includes("Updated")) { fanfic.LastUpdateOfFic = new Date(rawValue).getTime(); }
                    }

                    freeforms.length > 0 && tags.push({ 'tags': freeforms });
                    fanfic.AuthorURL = $('h3 a').last().attr('href');
                    fanfic.Rating = await getRating(fanfic.URL);
                    fanfic.Tags = tags;
                    fanfic.Language = 'English';
                    fanfic.Kudos = 100;
                    fanfic.Comments = 100;
                    fanfic.Bookmarks = 100;
                    fanfic.LastUpdateOfNote = new Date().getTime();
                    fanfic.Source = "Wattpad";
                    fanfic.Oneshot = fanfic.NumberOfChapters === 1 ? true : false;

                    let oldPdfPath = epubfile.replace('epub', 'pdf');
                    let fanficNaming = fixStringForPath(`${fanfic.Author}_${fanfic.FanficTitle} (${fanfic.FanficID})`);
                    let newFanficPath = `public/fandoms/${fanfic.FandomName}/fanfics/${fanficNaming}.epub`;
                    let imageNewPath = `public/fandoms/${fanfic.FandomName}/fanficsImages/${fanficNaming}.jpg`;
                    let newPdfPath = `public/fandoms/${fanfic.FandomName}/fanfics/${fanficNaming}.pdf`;

                    let pdfSaved = await saveFileToServer(oldPdfPath, newPdfPath);
                    let epubSaved = await saveFileToServer(epubfile, newFanficPath);
                    let imageSaved = await saveFileToServer(`${paths[0]}/cover.jpg`, imageNewPath);

                    if (pdfSaved || epubSaved) {
                        fanfic.SavedFic = true;
                        fanfic.savedAs = epubSaved && pdfSaved ? 'epub,pdf' : epubSaved ? 'epub' : 'pdf';
                        fanfic.fileName = fanficNaming;
                        fanfic.NeedToSaveFlag = false;
                        deleteFolderRecursive(paths[0])
                    } else {
                        fanfic.SavedFic = false;
                        fanfic.NeedToSaveFlag = true;
                    }

                    fanfic.image = imageSaved && `${fanficNaming}.jpg`;
                    await saveFanficToDB(fandomName, fanfic);
                }
                resolve();
            });
        });
        epub.parse();
    });

}