
const clc = require("cli-color");
const cheerio = require('cheerio');

exports.getDataFromAO3Epub = async (fandomName, data, deleted) => {
    console.log(clc.blue('[Downloader - Epub Reader] getDataFromAO3Epub()'));
    return new Promise(async function (resolve, reject) {
        let $ = cheerio.load(data);
        let fanfic = {};
        let todayDate = new Date();

        fanfic["LastUpdateOfNote"] = todayDate.getTime();

        fanfic["FandomName"] = fandomName;
        fanfic["Source"] = 'AO3';


        fanfic["FanficID"] = Number($('.message a').last().attr('href').split('/works/')[1]);
        fanfic["URL"] = $('.message a').last().attr('href');

        let nextText = $('dd:contains("Chapters:")').length > 0 ? 'Chapters' : 'Words';
        let tesupdatedText = $('dd:contains("Completed:")').length > 0 ? 'Completed' :
            $('dd:contains("Updated:")').length > 0 ? 'Updated' : nextText;


        let fanficPublishDate = $('dd:contains("Published:")').text().split('Published: ')[1].split(`${tesupdatedText}: `)[0];
        fanfic["PublishDate"] = fanficPublishDate === "" ? 0 : Number(new Date(fanficPublishDate).getTime());

        if (tesupdatedText === 'Chapters' || tesupdatedText === 'Words') {
            fanfic["LastUpdateOfFic"] = fanfic["PublishDate"];
        } else {
            let fanficUpdateDate = $(`dd:contains("${tesupdatedText}:")`).text().split(`${tesupdatedText}: `)[1].split(` ${nextText}`)[0];
            fanfic["LastUpdateOfFic"] = (fanficUpdateDate === "" && fanficPublishDate === "") ? 0 :
                fanficUpdateDate !== "" ? Number(new Date(fanficUpdateDate).getTime()) :
                    fanfic.PublishDate;
        }

        if ($('dd:contains("Chapters:")').length === 0) {
            fanfic["NumberOfChapters"] = 1;
            fanfic["Complete"] = true;
        } else {
            let chapters = $('dd:contains("Chapters:")').text().split('Chapters: ')[1].split('Words: ')[0];
            fanfic["NumberOfChapters"] = Number(chapters.split('/')[0]);

            let chapCurrent = fanfic.NumberOfChapters;
            let chapEnd = chapters.split('/')[1];
            fanfic["Complete"] = (String(chapEnd) !== '?' && (Number(chapCurrent) === Number(chapEnd))) ? true : false;
        }

        fanfic["Oneshot"] = (fanfic["Complete"] && fanfic["NumberOfChapters"] === 1) ? true : false;

        fanfic["Words"] = Number($('dd:contains("Words:")').text().split('Words: ')[1]);

        fanfic["FanficTitle"] = $('h1').text();

        if ($('.byline a').length > 1) {
            $('.byline').children('a').each(index => {
                let authorTag = $('.byline').children('a').eq(index);
                if (index === 0) {
                    fanfic["Author"] = authorTag.text();
                    fanfic["AuthorURL"] = authorTag.attr('href');
                } else {
                    fanfic[`Author${index}`] = authorTag.text();
                    fanfic[`AuthorURL${index}`] = authorTag.attr('href');
                }
            });
        } else {
            fanfic["Author"] = $('.byline a').text();
            fanfic["AuthorURL"] = $('.byline a').attr('href');
        }

        let rating = ($('dt:contains("Rating:")').length > 0) && $('dt:contains("Rating:")').next('dd').text();
        switch (rating) {
            case 'General Audiences': { rating = 'general'; break }
            case 'Teen And Up Audiences': { rating = 'teen'; break }
            case 'Mature': { rating = 'mature'; break }
            case 'Explicit': { rating = 'explicit'; break }
            case 'Not Rated': { rating = 'none'; break }
            default: rating = 'none';
        }
        fanfic["Rating"] = rating;

        let tags = [], warnings = [], relationships = [], characters = [], freeforms = [], fandomsTags = [];

        const tagsArr = [
            [warnings, 'Archive Warning:'], [relationships, 'Relationship:'],
            [characters, 'Character:'], [freeforms, 'Additional Tags:'],
            [fandomsTags, 'Fandom:']
        ];
        tagsArr.forEach(tagArr => {
            $(`dt:contains("${tagArr[1]}")`).length > 0 && $(`dt:contains("${tagArr[1]}")`).next('dd').children('a').each(index => {
                let tag = $(`dt:contains("${tagArr[1]}")`).next('dd').children('a').eq(index);
                tagArr[0].push(tag.text());
            });
        });
        if (warnings[0] == 'No Archive Warnings Apply' || warnings[0] == 'Creator Chose Not To Use Archive Warnings') {
            tags.push({ 'relationships': relationships }, { 'characters': characters }, { 'tags': freeforms });
        } else {
            tags.push({ 'warnings': warnings }, { 'relationships': relationships }, { 'characters': characters }, { 'tags': freeforms });
        }
        fanfic["Tags"] = tags;
        fanfic["FandomsTags"] = fandomsTags;

        fanfic["Language"] = 'English';
        fanfic["Description"] = $('blockquote').html();

        fanfic["Hits"] = 100;
        fanfic["Kudos"] = 100;
        fanfic["Comments"] = 100;
        fanfic["Bookmarks"] = 100;
        fanfic["Deleted"] = deleted;

        let series = $('dt:contains("Series:")').length > 0 && $('dt:contains("Series:")').next('dd').find('a').text();
        if (series) {
            fanfic["Series"] = series;
            fanfic["SeriesPart"] = fanfic["Series"] && Number($('dt:contains("Series:")').next('dd').text().split('Part ')[1].split(' of')[0]);
            fanfic["SeriesURL"] = fanfic["Series"] && $('dt:contains("Series:")').next('dd').find('a').attr('href');
        }

        resolve(fanfic)
    })
}