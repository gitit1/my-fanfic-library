const clc = require("cli-color");
const cheerio = require('cheerio');

const {getUrlBodyFromAo3} = require('../../../../helpers/getUrlBodyFromAo3');

exports.getPublishDate = async (jar,url)=>{
    console.log(clc.bgGreenBright('[ao3 controller] getPublishDate()'));
    console.log('getPublishDate - ',url);
    return await new Promise(async function(resolve, reject) {  
        url = url + '?view_adult=true';
        await getUrlBodyFromAo3(jar,url).then(urlBody=>{
            let $ = cheerio.load(urlBody);
            publishDate =  $('dd.published').text()
            console.log('publishDate 1:',publishDate)
            publishDate = (publishDate===""||!publishDate) ? 0 : new Date(publishDate).getTime();
            console.log('publishDate 2:',publishDate)
            resolve(publishDate)
        });
    });
}