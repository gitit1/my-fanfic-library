const clc = require("cli-color");
const pdf = require('pdf-parse');
const { getDataFromAO3PDF } = require('./helpers/getDataFromAO3PDF');

exports.readPdf = (fandomName, file, deleted) => {
    console.log(clc.greenBright('[Downloader - PDF Reader] readPdf()'));
    return new Promise(async function (resolve, reject) {
        await getPdfMetadata(fandomName, file, deleted).then(fanfic=>resolve(fanfic));
        reject(false);
    })
}

const getPdfMetadata = (fandomName, file, deleted) => {
    console.log(clc.blue('[Downloader - PDF Reader] getPdfMetadata()'));

    return new Promise(async function (resolve, reject) {
        let pdfData;

        let options = {
            max: 1
        }

        pdf(file,options).then(async function(data) {
            pdfData = data.text;
            if(pdfData.includes('Archive of Our Own')){//AO3 PDF
                let fanfic = await getDataFromAO3PDF(fandomName, pdfData, deleted);
                resolve(fanfic)
            }else {
                reject()
            }
        });
    });

}