const clc = require("cli-color");
const cheerio = require('cheerio');

let request = require('request')
let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});

const {getUrlBodyFromAo3} = require('../../helpers/getUrlBodyFromAo3');

exports.getPublishDate = async (url)=>{
    console.log(clc.bgGreenBright('[ao3 controller] getPublishDate()'));
    return await new Promise(async function(resolve, reject) {  
        url = url + '?view_adult=true';
        await getUrlBodyFromAo3(url).then(urlBody=>{
            let $ = cheerio.load(urlBody);
            publishDate =  $('dd.published').text()
            // console.log('publishDate 1:',publishDate)
            publishDate = (publishDate) ==="" ? 0 : new Date(publishDate).getTime();
            // console.log('publishDate 2:',publishDate)
            resolve(publishDate)
        });
    });
}