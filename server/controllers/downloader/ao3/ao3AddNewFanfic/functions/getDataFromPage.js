
const clc = require("cli-color");
const cheerio = require('cheerio');

const { loginToAO3 } = require('../../helpers/loginToAO3');
const { getUrlBodyFromAo3 } = require('../../helpers/getUrlBodyFromAo3');

exports.getDataFromPage = (jar, url, fandomName) => {
    return new Promise(async function (resolve, reject) {
        await loginToAO3();

        url = url.includes('chapters') ? url.split('/chapters/')[0] : url;
        let body = await getUrlBodyFromAo3(jar, url + '?view_adult=true');
        let $ = cheerio.load(body);

        let fanfic = {};
        let todayDate = new Date();

        fanfic["LastUpdateOfNote"] = todayDate.getTime();

        fanfic["FandomName"] = fandomName;
        fanfic["Source"] = 'AO3';
        fanfic["URL"] = url;

        id = url.split('/works/')[1];
        id = id.includes('chapters') ? id.split('/chapters/')[0] : id;
        fanfic["FanficID"] = Number(id);

        fanficUpdateDate = $('dd.status').text();
        fanficPublishedDate = $('dd.published').text();

        fanfic["LastUpdateOfFic"] = fanficUpdateDate === "" ? 0 : new Date(fanficUpdateDate).getTime();
        fanfic["PublishDate"] = fanficPublishedDate === "" ? 0 : new Date(fanficPublishedDate).getTime();

        if (fanficUpdateDate === "" && fanficPublishedDate === "") {
            console.log(clc.red('ERROR IN FANFIC DATE:', fanfic["FanficID"]))
            reject('error in fanficUpdateDate');
        } else if (fanficPublishedDate !== "") {
            fanfic["LastUpdateOfFic"] = fanfic["PublishDate"];
        } else {
            reject('error in Published Date: ', fanfic["FanficID"]);
        }

        fanfic["NumberOfChapters"] = Number($('dd.chapters').text().split('/')[0]);
        chapCurrent = Number($('dd.chapters').text().split('/')[0])
        chapEnd = Number($('dd.chapters').text().split('/')[1])

        fanfic["Complete"] = (String(chapEnd) !== '?' && (Number(chapCurrent) === Number(chapEnd))) ? true : false
        fanfic["Oneshot"] = (fanfic["Complete"] && fanfic["NumberOfChapters"] === 1) ? true : false


        fanfic["FanficTitle"] = $('#workskin h2.heading').first().text().trim();
        fanfic["Author"] = $('#workskin h3.heading a[rel=author]').text().trim();
        fanfic["Author"] = (fanfic["Author"] === fanfic["FanficTitle"] || fanfic["Author"] == "") ? 'Anonymous' : fanfic["Author"]

        fanfic["AuthorURL"] = 'https://archiveofourown.org' + $('#workskin h3.heading a').attr('href');

        rating = $('dd.rating li.last a.tag').text();
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
        $('dd.warning ul').children('li').each(index => { warnings.push($('dd.warning ul').children('li').eq(index).children('a').text()); })
        $('dd.relationship ul').children('li').each(index => { relationships.push($('dd.relationship ul').children('li').eq(index).children('a').text()); })
        $('dd.character ul').children('li').each(index => { characters.push($('dd.character ul').children('li').eq(index).children('a').text()) })
        $('dd.freeform ul').children('li').each(index => { freeforms.push($('dd.freeform ul').children('li').eq(index).children('a').text()); })
        $('dd.fandom  ul').children('li').each(index => { fandomsTags.push($('dd.fandom ul').children('li').eq(index).children('a').text()); })
        tags.push({ 'warnings': warnings }, { 'relationships': relationships }, { 'characters': characters }, { 'tags': freeforms });

        fanfic["Tags"] = tags;
        fanfic["FandomsTags"] = fandomsTags;

        fanfic["Language"] = $('dd.language').text()
        fanfic["Description"] = $('blockquote.userstuff').html().trim();
        fanfic["Hits"] = $('dd.hits').text() === "" ? 0 : Number($('dd.hits').text());
        fanfic["Kudos"] = $('dd.kudos').text() === "" ? 0 : Number($('dd.kudos').text());
        fanfic["Comments"] = ($('dd.comments').text()) === "" ? 0 : Number($('dd.comments').text());
        fanfic["Bookmarks"] = ($('dd.bookmarks a').text()) === "" ? 0 : Number($('dd.bookmarks').text());
        fanfic["Words"] = Number($('dd.words').text().replace(/,/g, ''));

        fanfic["Series"] = $('dd.series .position a').text() === "" ? false : $('dd.series .position a').text();
        fanfic["SeriesPart"] = fanfic["Series"] && $('dd.series .position').text().replace(/.*Part ([1-9]).*/g, '$1');
        fanfic["SeriesURL"] = fanfic["Series"] && 'https://archiveofourown.org' + $('dd.series .position a').attr('href');

        fanfic["NeedToSaveFlag"] = false;
        fanfic["Deleted"] = false;

        resolve(fanfic);
    });
}