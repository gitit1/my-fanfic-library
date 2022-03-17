
const clc = require("cli-color");
const cheerio = require('cheerio');
const { getUrlBodyFromSite } = require('../../../ff/helpers/getUrlBodyFromSite');

exports.getDataFromWattpadEpub = async (fandomName, data, deleted) => {
    console.log(clc.xterm(175)('[Downloader - Epub Reader] getDataFromAO3Epub()'));
    return new Promise(async function (resolve, reject) {
        let fanfic = {};
        let $ = cheerio.load(data);
        let tags = [], freeforms = [];

        fanfic.Author = $('h3 a').last().text();
        fanfic.FanficTitle = $('h3 a').first().text();
        fanfic.FanficID = $('h3 a').first().attr('href').split('/story/')[1];
        fanfic.FandomName = fandomName;
        fanfic.AuthorURL = $('h3 a').last().attr('href');
        fanfic.URL = $('h3 a').first().attr('href');
        
        fanfic.Complete = $('div').html().split(/<br *\/?>/i)[3].split('</b> ')[1] === 'Complete' ? true : false;
 
        for (let index = 0; index < 15; index++) {
            const attr = $('div').html().split(/<br *\/?>/i)[index];
            if (attr === undefined) { break }
            const rawValue = attr.split('</b> ')[1]
            if (attr.includes("Chapters")) {
                fanfic.NumberOfChapters = Number(rawValue);
            }
            if (attr.includes("Genre")) {
                rawValue.split(',').forEach(tag => {
                    freeforms.push(tag)
                });
            }
            if (attr.includes("Read Count")) { fanfic.Hits = parseFloat(rawValue.split(',').join('')); }
            if (attr.includes("Words")) { fanfic.Words = parseFloat(rawValue.split(',').join('')); }
            if (attr.includes("Summary")) { fanfic.Description = rawValue; }
            if (attr.includes("Published")) { fanfic.PublishDate = new Date(rawValue).getTime(); }
            if (attr.includes("Updated")) { fanfic.LastUpdateOfFic = new Date(rawValue).getTime(); }
        }

        freeforms.length > 0 && tags.push({ 'tags': freeforms });

        fanfic.Rating = await getRating(fanfic.URL);
        fanfic.Tags = tags;
        fanfic.Language = 'English';
        fanfic.Kudos = 100;
        fanfic.Comments = 100;
        fanfic.Bookmarks = 100;
        fanfic.LastUpdateOfNote = new Date().getTime();
        fanfic.Source = "Wattpad";
        fanfic.Oneshot = fanfic.NumberOfChapters === 1 ? true : false;
        fanfic.Deleted = deleted;

        
        resolve(fanfic)
    })
}

const getRating = async (url) => {
    console.log(clc.xterm(175)('[WPD] getRating()'));
    return new Promise(async function (resolve, reject) {
        let body = await getUrlBodyFromSite(url);
        let $ = cheerio.load(body);
        //console.log(body)
        // console.log($('span:contains(" Mature ")').text())
        if ($('span:contains(" Mature ")').text() === ' Mature ') {
            resolve('mature')
        }
        resolve('teen');
    });
}