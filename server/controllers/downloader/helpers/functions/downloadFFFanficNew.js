const fs = require('fs');
const puppeteer = require('puppeteer');
let request = require('request');
const clc = require("cli-color");

let jar = request.jar();
request = request.defaults({ jar: jar, followAllRedirects: true });

const fanficsPath = "public/fandoms";

exports.downloadFFFanficNew = async (fandomName, storyId, fileName) => {
    const fullFilename = `${fanficsPath}/${fandomName.toLowerCase()}/fanfics/${fileName}.epub`;
    const url = `https://www.fanfiction.net/s/${storyId}`;

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
            await page.goto('https://fichub.net/');
            console.log(clc.xterm(75)('downloader: getting the url...'));
            await page.waitFor('body')
            // await page.screenshot({ path: 'example.png' });
            await page.focus('input');
            await page.keyboard.type(url);
            console.log(clc.xterm(75)('downloader: downloading epub...'));
            await page.click('#x')
            // console.log('url:', url)
            console.log(clc.xterm(75)('downloader: waiting for epub to be ready...'));
            await new Promise(resolve => setTimeout(resolve, 10000));
            page.waitForSelector('#i > p:nth-child(2) > a');
            // const fileUrl = await fanficUrl.evaluate(anchor => anchor.getProperty('href'))
            const fileUrl = await page.$eval("#i > p:nth-child(2) > a", (elm) => elm.href);
            console.log(clc.xterm(75)('downloader: epub is ready in this url: ', fileUrl));

            const file = fs.createWriteStream(fullFilename);
            request({ uri: fileUrl, jar, credentials: 'include' }).pipe(file);

            file.on('finish', () => {
                console.log('finished stramimg file');
            }).on('close', async () => {
                fs.readFileSync(fullFilename, 'utf8');
                console.log('closed straming');
                resolve(0);
            }).on('error', () => {
                console.log(clc.red(`There was an error in: downloader(): ${url} , filename: ${fullFilename}, collectionName: ${collectionName}`))
                reject(1);
            }).on('timeout', async function (e) {
                    console.log(`TimeOut - redownloading: ${url}`)
                    downloadFanfic(fandomName, storyId, fileName);
            });              
        });
    } catch (error) {
        console.log(clc.red('error in download file:',error));
    } finally{
        console.log(clc.green('downloadFanfic::: Finally close connection'));
        await page.close();
        await browser.close();
    }
}