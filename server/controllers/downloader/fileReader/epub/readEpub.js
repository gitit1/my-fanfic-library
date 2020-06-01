const clc = require("cli-color");
let EPub = require("epub");
const { getDataFromAO3Epub } = require('./helpers/getDataFromAO3Epub');
const { getDataFromFF2BookEpub } = require('./helpers/getDataFromFF2BookEpub');
const { getDataFromWattpadEpub } = require('./helpers/getDataFromWattpadEpub');

exports.readEpub = (fandomName, tempPath, deleted) => {
    console.log(clc.greenBright('[Downloader - Epub Reader] readEpub()'));
    return new Promise(async function (resolve, reject) {
        await getEpubMetadata(fandomName, tempPath, deleted).then(fanfic=>resolve(fanfic));
        reject(false);
    })
}

const getEpubMetadata = (fandomName, tempPath, deleted) => {
    console.log(clc.blue('[Downloader - Epub Reader] getEpubMetadata()', tempPath));

    return new Promise(async function (resolve, reject) {
        let epub = new EPub(tempPath, '/images/', '/links/');
        epub.on("end", async function () {

            console.log('getEpubMetadata - get data of first chapter: ',epub.flow[0].id);

            switch (epub.flow[0].id) {               
                case 'preface'://ao3
                    epub.getChapter("preface", async function (err, data) {
                        let fanfic = await getDataFromAO3Epub(fandomName, data, deleted);
                        resolve(fanfic)
                    });
                    break;
                case 'title'://www.FF2EBOOK.com
                    epub.getChapter("title", async function (err, data) {
                        let fanfic = await getDataFromFF2BookEpub(fandomName, data, deleted);
                        resolve(fanfic)
                    });
                    break;
                case 'title_page'://wattpad
                    epub.getChapter("title_page", async function (err, data) {
                        let fanfic = await getDataFromWattpadEpub(fandomName, data, deleted);
                        resolve(fanfic)
                    });
                    break; 
                case 'cover'://wattpad
                    epub.getChapter("title_page", async function (err, data) {
                        let fanfic = await getDataFromWattpadEpub(fandomName, data, deleted);
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