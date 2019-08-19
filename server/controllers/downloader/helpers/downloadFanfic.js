const fs = require('fs');
const puppeteer = require('puppeteer');

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});

const fanficsPath = "public/fandoms";

exports.downloadFanfic = async (url,source,filename,type,fandomName,id) =>{
    let fullFilename = `${fanficsPath}/${fandomName.toLowerCase()}/fanfics/${filename}.${type}`
    let sourceCode = (source==='FF') ? 'ffnet' : null

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://ff2ebook.com/');
    await page.screenshot({path: 'example.png'});
    await page.focus('#fic-input-form input')
    await page.keyboard.type(url)
    await page.click('#fic-input-submit')
    console.log('url:',url)
    
    setTimeout(() => {
        url = `http://ff2ebook.com/download.php?source=${sourceCode}&id=${id}&filetype=${type}`
        new Promise((resolve, reject) => {
            console.log('filename:',fullFilename)
            console.log('url:',url)
            const file = fs.createWriteStream(fullFilename);
            request({url,jar, credentials: 'include'}).pipe(file);
    
            file.on('finish',() => {
                resolve(0)
            }).on('close',() => {
                fs.readFileSync(fullFilename, 'utf8');    
            }).on('error',() => 
                reject(console.log(`There was an error in: downloader(): ${url} , filename: ${fullFilename}`)
            )).on('timeout', function(e) {
                console.log(`TimeOut - redownloading: ${url}`)
                downloadFanfic(source,filename,type,fandomName);
            });  
        })
    }, 20000);
    return null;
}

//http://ff2ebook.com/download.php?source=ffnet&id=13198013&filetype=epub