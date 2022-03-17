
const clc = require("cli-color");
const cheerio = require('cheerio');
const { convertDataIntoHtml } = require('./convertDataIntoHtml');

exports.getDataFromAO3PDF = async (fandomName, data, deleted) => {
    console.log(clc.xterm(175)('[Downloader - PDF Reader] getDataFromAO3PDF()'));
    return new Promise(async function (resolve, reject) {

        let fanfic = {}, todayDate = new Date();

        let html = await convertDataIntoHtml(data)
        let $ = cheerio.load(html);

        fanfic["LastUpdateOfNote"] = todayDate.getTime();
        fanfic["FandomName"] = fandomName;
        fanfic["Source"] = 'AO3';

        fanfic["FanficID"] = Number($('.URL').text().split('/works/')[1]);
        fanfic["URL"] = $('.URL').text();
        fanfic["FanficTitle"] = $('.Title').text();
        fanfic["Author"] = $('.Author').text();
        fanfic["AuthorURL"] = '';

        const stateAttr = $('.Stats').text().split(' ');

        const published = stateAttr.indexOf("Published:");
        const updated = stateAttr.indexOf("Updated:");
        fanfic["PublishDate"] = new Date(stateAttr[published + 1]).getTime();
        fanfic["LastUpdateOfFic"] = updated > -1 ? new Date(stateAttr[updated + 1]).getTime() : fanfic["PublishDate"];

        const chapters = stateAttr.indexOf("Chapters:");
        fanfic["NumberOfChapters"] = chapters > -1 ? Number(stateAttr[chapters + 1].split('/')[0]) : 1;
        fanfic["Complete"] = chapters === -1 || (stateAttr[chapters + 1].split('/')[0] === stateAttr[chapters + 1].split('/')[1]);
        fanfic["Oneshot"] = (chapters === -1 || (fanfic["Complete"] && fanfic["NumberOfChapters"] === 1)) ? true : false;

        const words = stateAttr.indexOf("Words:");
        fanfic["Words"] = Number(stateAttr[words + 1]);

        let rating = $('.Rating').text();
        switch (rating) {
            case 'General Audiences': { rating = 'general'; break }
            case 'Teen And Up Audiences': { rating = 'teen'; break }
            case 'Mature': { rating = 'mature'; break }
            case 'Explicit': { rating = 'explicit'; break }
            case 'Not Rated': { rating = 'none'; break }
            default: rating = 'none';
        }
        fanfic["Rating"] = rating;

        let tags = [];
        
        let warnings = $('.Archive').text() && $('.Archive').text().trim().split(',');
        let relationships = $('.Relationship').text() && $('.Relationship').text().trim().split(',');
        let characters = $('.Character').text() && $('.Character').text().trim().split(',');
        let freeforms = $('.Additional').text() && $('.Additional').text().trim().split(',');
        let fandomsTags = $('.Fandom').text() && $('.Fandom').text().trim().split(',');
        if (warnings[0] == 'No Archive Warnings Apply' || warnings[0] == 'Creator Chose Not To Use Archive Warnings') {
            tags.push({ 'relationships': relationships }, { 'characters': characters }, { 'tags': freeforms });
        } else {
            tags.push({ 'warnings': warnings }, { 'relationships': relationships }, { 'characters': characters }, { 'tags': freeforms });
        }
        fanfic["Tags"] = tags;
        fanfic["FandomsTags"] = fandomsTags;

        fanfic["Language"] = 'English';
        
        fanfic["Description"] = $('.Summary').text();

        fanfic["Hits"] = 100;
        fanfic["Kudos"] = 100;
        fanfic["Comments"] = 100;
        fanfic["Bookmarks"] = 100;
        fanfic["Deleted"] = deleted;

        if($('.Series').text()){
            fanfic["Series"] = $('.Series').text().split('Part ')[1].split(' of ')[1];
            fanfic["SeriesPart"] = $('.Series').text().split('Part ')[1].split(' of ')[0];
            fanfic["SeriesURL"] = null;
        }

        resolve(fanfic)

    })
}