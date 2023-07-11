const clc = require("cli-color");
const cheerio = require('cheerio');
const fs = require('fs');
let request = require('request')

const fanficsPath = "public/fandoms";
const { fixStringForPath } = require('../../../helpers/fixStringForPath')


exports.saveFanficToServerHandler = async (jar, url, urlBody, fandomName, saveMethod) => {
    return saveFanficToServer(jar, url, urlBody, fandomName, saveMethod)
}

const saveFanficToServer = async (jar, url, urlBody, fandomName, saveMethod) => {
    try {
        let links = [], methods = [];
        let fanficId = 0
        let filename = '';
        saveMethods = (saveMethod !== '' || saveMethod || null || saveMethod.length > 0) ? saveMethod : 'epub';
        (!saveMethods.includes(",")) ? methods.push(saveMethods) : methods = saveMethods.split(',');
        return await new Promise(async function (resolve, reject) {
            let $ = cheerio.load(urlBody);

            await Promise.all(
                await methods.map(async (method) => {
                    let link = await $(`.download ul li a:contains("${method.toUpperCase()}")`).attr('href');
                    let fanficName = await $('div#workskin h2').first().text().trim().replace(/[^\w ]/g, '');
                    let authorName = await ($('div#workskin h3').first().text().replace(/\s+/g, " ")) === 'Anonymous' ? 'Anonymous' : $('div#workskin h3 a').first().text().replace(/\s+/g, " ");
                    authorName = (authorName === '') ? 'Anonymous' : authorName;
                    fanficId = await link.replace(/\/downloads\/(.*)\/.*/, "$1");
					if(fanficName.length > 60){
                        fanficName = fanficName.slice(60)
                    }
                    let fanficNewName = `${authorName}_${fanficName} (${fanficId}).${method}`
                    filename = `${authorName}_${fanficName} (${fanficId})`;
                    filename = fixStringForPath(filename);

                    await links.push([`https://archiveofourown.org${link}`, fanficNewName])
                })
            ).then(() => {
                Promise.all(links.map(x => downloader(jar, x[0], `${fanficsPath}/${fandomName.toLowerCase()}/fanfics/${x[1]}`))).then(res => {
                    let counter = res.reduce((a, b) => a + b, 0);
                    if (counter === 0) {
                        resolve([fanficId, filename, saveMethods])
                    } else {
                        resolve([-1, null, null])
                    }
                })
            }).catch(error => {
                console.log(clc.red(`Error in saveFanficToServerHandler(): ${url} ,  filename: ${filename}, error: ${error}`))
                reject()
            })
        })
    } catch (error) {
        return [-1, null, null]
    }
}


const downloader = (jar, url, filename) => {
    return new Promise((resolve, reject) => {
        // console.log('url:',url)
        console.log('downloader - filename:', filename)
        const file = fs.createWriteStream(filename);
        request({ url, jar, credentials: 'include' }).pipe(file);

        file.on('finish', () => {
            resolve(0)
        }).on('close', () => {
            fs.readFileSync(filename, 'utf8');
        }).on('error', () =>
            reject(console.log(`There was an error in: downloader(): ${url} , filename: ${filename}`)
            )).on('timeout', function (e) {
                console.log(`TimeOut - redownloading: ${url}`)
                downloader(url, fileName);
            });
    })
};