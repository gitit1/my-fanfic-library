const clc = require("cli-color");
const cheerio = require('cheerio');

exports.getPublishDate = async (urlBody)=>{
    console.log(clc.bgGreenBright('[ao3 controller] getPublishDate()'));
    console.log('getPublishDate - ',url);
    return await new Promise(async function(resolve, reject) {         
        let $ = cheerio.load(urlBody);
        publishDate =  $('dd.published').text()
        publishDate = (publishDate===""||!publishDate) ? 0 : new Date(publishDate).getTime();
        resolve(publishDate)
    });
}