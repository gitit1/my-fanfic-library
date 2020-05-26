const clc = require("cli-color");
let EPub = require("epub");
const cheerio = require('cheerio');
const { getDataFromAO3Epub } = require('./helpers/getDataFromAO3Epub');
const { getDataFromFF2BookEpub } = require('./helpers/getDataFromFF2BookEpub');

exports.readEpub = (fandomName, tempPath) => {
    console.log(clc.greenBright('[Downloader - Epub Reader] readEpub()'));
    return new Promise(async function (resolve, reject) {
        await getEpubMetadata(fandomName, tempPath).then(fanfic=>resolve(fanfic));
        reject(false);
    })
}

const getEpubMetadata = (fandomName, tempPath) => {
    console.log(clc.blue('[Downloader - Epub Reader] getEpubMetadata()', tempPath));

    return new Promise(async function (resolve, reject) {
        let fanfic = {}
        let epub = new EPub(tempPath, '/images/', '/links/');
        epub.on("end", async function () {

            console.log(epub.flow[0].id);
            //TODO: TEMP
            // epub.flow.forEach(function(chapter){
            //     console.log(chapter.id);
            // });

            switch (epub.flow[0].id) {               
                case 'preface'://ao3
                    epub.getChapter("preface", async function (err, data) {
                        let fanfic = await getDataFromAO3Epub(fandomName, data);
                        resolve(fanfic)
                    });
                    break;
                case 'title'://www.FF2EBOOK.com
                    epub.getChapter("title", async function (err, data) {
                        let fanfic = await getDataFromFF2BookEpub(fandomName, data);
                        resolve(fanfic)
                    });
                    break;
                default:
                    reject()
                    break;
            }
        });
        epub.parse();
    });

}