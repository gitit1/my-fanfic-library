
const clc = require("cli-color");
const cheerio = require('cheerio');

exports.getDataFromFF2BookEpub = async (fandomName, data, deleted) => {
    console.log(clc.blue('[Downloader - Epub Reader] getDataFromAO3Epub()'));
    return new Promise(async function (resolve, reject) {

        let newData = data.replace(/<span class="bold">(.*)<\/span>(.*?)<br \/>/gim, '<p class="attr">$1<span class="data">$2</span><br /></p>');
        let $ = cheerio.load(newData);

        let fanfic = {};
        let todayDate = new Date();

        fanfic["LastUpdateOfNote"] = todayDate.getTime();

        fanfic["FandomName"] = fandomName;
        fanfic["Source"] = 'FF';

        fanfic["FanficID"] = Number($('.fic-title a').attr('href').split('/s/')[1]);
        fanfic["URL"] = $('.fic-title a').attr('href');
        fanfic["FanficTitle"] = $('.fic-title a').text();

        fanfic["Author"] = $('.fic-author a').text();
        fanfic["AuthorURL"] = $('.fic-author a').attr('href');

        fanfic["Description"] = $('.attr:contains("Summary:")') ? $('.attr:contains("Summary:") span').text().trim() : '';
        fanfic["Complete"] = $('.attr:contains("Status:")') ? $('.attr:contains("Status:") span').text().trim() : '';
        fanfic["Complete"] = (fanfic["Complete"] === 'Completed') ? true : false;
        fanfic["PublishDate"] = Number(new Date($('.attr:contains("Published:") span').text().trim()).getTime())
        fanfic["LastUpdateOfFic"] = Number(new Date($('.attr:contains("Last updated:") span').text().trim()).getTime())
        fanfic["NumberOfChapters"] = Number($('.attr:contains("Chapters count:") span').text().trim());
        fanfic["Oneshot"] = (fanfic["Complete"] && fanfic["NumberOfChapters"] === 1) ? true : false;
        fanfic["Words"] = Number($('.attr:contains("Words count:") span').text().trim().replace(',',''));
        fanfic["Rating"] = 'none';

        let tags = [], relationships = [], characters = [], fandomsTags = [];

        let charTag = $('.attr:contains("Pairings/Main char.:") span').text();
        if (charTag.includes('[')) {
            const list = charTag.split(']');
            list.forEach(item => {
                if (item.includes('[')) {
                    relationships.push(item.replace('[', '').trim());
                    item.replace('[', '').split(',').forEach(ch => (ch.trim() !== '') && characters.push(ch.trim()))
                } else {
                    item.split(',').forEach(ch => (ch.trim() !== '') && characters.push(ch.trim()))
                }
            })
        } else {
            const list = charTag.split(',');
            if (list.length === 2) {
                relationships.push(charTag.trim());
            }
            list.forEach(ch => (ch.trim() !== '') && characters.push(ch.trim()))
        }
        fandomsTags.push($('.attr:contains("Fic type:") span').text().replace(/TV Shows\/|Movie\/|Cartoons\//gim, '').trim())

        tags.push({ 'relationships': relationships }, { 'characters': characters });
        fanfic["Tags"] = tags;
        fanfic["FandomsTags"] = fandomsTags;

        fanfic["Language"] = 'English';
        fanfic["Hits"] = 100;
        fanfic["Kudos"] = 100;
        fanfic["Comments"] = 100;
        fanfic["Bookmarks"] = 100;
        fanfic["Deleted"] = deleted;

        resolve(fanfic)
    })
}