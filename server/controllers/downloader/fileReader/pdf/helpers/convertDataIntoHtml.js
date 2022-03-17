
const clc = require("cli-color");

exports.convertDataIntoHtml = async (data) => {
    console.log(clc.xterm(175)('[Downloader - PDF Reader] getDataFromAO3PDF()'));
    return new Promise(async function (resolve, reject) {
        let htmlData = "<div>", counterOfData = false;

        const attrSting = 'Rating: , Archive Warning: , Category: , Fandom: , Relationship: , Character: , Additional Tags: , Series: , Stats: , Summary';

        let = dataArr = data.split(/\r?\n/);
        for (let i = 0; i < dataArr.length; i++) {
            if (dataArr[i].includes('Posted originally on') || dataArr[i].trim() === '') {
                // console.log('1', dataArr[i])
                if (dataArr[i].includes('archiveofourown.org')) {
                    htmlData = htmlData + `<p class="URL">${dataArr[i].split(' at ')[1].slice(0, -1)}</p>`;
                }
                continue;
            }
            if (dataArr[i].includes('archiveofourown.org') && !dataArr[i].includes('Posted originally on')) {
                // console.log('2', dataArr[i])
                htmlData = htmlData + `<p class="URL">${dataArr[i].replace('//download', '//www').slice(0, -1)}</p>`;
            }
            if (attrSting.includes(dataArr[i])) {
                htmlData = htmlData + `<p class="${dataArr[i].replace(':', '')}">`;
                counterOfData = true;
            }
            if (counterOfData && !attrSting.includes(dataArr[i]) && dataArr[i] !== 'Notes') {
                // console.log('3', dataArr[i])
                if (dataArr[i + 1] !== undefined) {
                    if (dataArr[i + 1].startsWith('by ')) {
                        htmlData = htmlData + `</p><p class="Title">${dataArr[i]}</p>`;
                    } else if (dataArr[i + 1].includes('Summary')) {
                        htmlData = htmlData + `<p class="Author">${dataArr[i].replace('by ', '')}</p>`;
                    } else if (attrSting.includes(dataArr[i + 1])) {
                        htmlData = htmlData + dataArr[i] + `</p>`;
                        counterOfData = false;
                    } else {
                        htmlData = htmlData + ' ' + dataArr[i];
                    }
                }

            }
            if (dataArr[i] === 'Notes') {
                htmlData = htmlData + `</p>`;
                break;
            }
        }
        htmlData = htmlData + "</div>"

        resolve(htmlData)

    })
}