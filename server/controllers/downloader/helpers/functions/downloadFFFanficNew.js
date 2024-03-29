const puppeteer = require('puppeteer');
const clc = require("cli-color");

exports.downloadFFFanficNew = async (fandomName, storyId, fileName) => {
  const fanficsPath = "public/fandoms";
  const fullFilename = `${fanficsPath}/${fandomName.toLowerCase()}/fanfics/${fileName}.epub`;
  const url = `https://www.fanfiction.net/s/${storyId}`;

  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: [
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--lang=ja,en-US;q=0.9,en;q=0.8',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    ],
  });
  const page = await browser.newPage();
  try {
    console.log(clc.xterm(75)('downloader: getting the url...'));
    await page.goto('https://fichub.net/', { timeout: 10000, waitUntil: 'load' });

    await page.focus('input');
    await page.keyboard.type(url);
    console.log(clc.xterm(75)('downloader: downloading epub...'));
    await page.click('#x');

    console.log(clc.xterm(75)('downloader: waiting for epub to be ready...'));
    await page.waitForSelector('#i > p:nth-child(2) > a', { timeout: 50000 });

    const fileUrl = await page.$eval('#i > p:nth-child(2) > a', (elm) => elm.href);
    console.log(clc.xterm(75)('downloader: epub is ready in this url: ', fileUrl));

    const file = fs.createWriteStream(fullFilename);
    request({ uri: fileUrl, jar, credentials: 'include' }).pipe(file);

    return new Promise((resolve, reject) => {
      file.on('finish', () => {
        console.log('finished streaming file');
        resolve(0);
      }).on('close', async () => {
        fs.readFileSync(fullFilename, 'utf8');
        console.log('closed streaming');
        resolve(0);
      }).on('error', (error) => {
        console.log(clc.red(`There was an error in: downloader(): ${url} , filename: ${fullFilename}, collectionName: ${collectionName}`));
        reject(1);
      }).on('timeout', async () => {
        console.log(`Timeout - redownloading: ${url}`);
        reject(1);
      });
    });
  } catch (error) {
    if (error instanceof puppeteer.errors.TimeoutError) {
      console.log(clc.red('Timeout error occurred:', error));
    } else {
      console.log(clc.red('Other error occurred:', error));
    }
  } finally {
    console.log(clc.green('downloadFanfic::: Finally close connection'));
    await page.close();
    await browser.close();
  }
};