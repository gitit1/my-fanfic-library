
const cheerio = require('cheerio');
const { getUrlBodyFromAo3 } = require('./getUrlBodyFromAo3');

exports.getNumberOfSearchPages =  async (jar, ao3URL, log) => {  
    let numberOfPages = 0;
    return new Promise(async function(resolve, reject) {
        let body = await getUrlBodyFromAo3(jar, ao3URL, log);

        let $ = cheerio.load(body);
    
        if (Number($('#main').find('ol.pagination li').eq(-2).text()) === 0) {
            numberOfPages = 1
        } else if (Number($('#main').find('ol.pagination li').eq(-2).text()) >= 10) {
            numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text());
        } else {
            numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text());
        }
        resolve(numberOfPages)
     })
}