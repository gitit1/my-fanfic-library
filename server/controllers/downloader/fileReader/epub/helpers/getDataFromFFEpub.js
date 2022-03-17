
const clc = require("cli-color");
const cheerio = require('cheerio');

exports.getDataFromFFEpub = async (fandomName, data, deleted) => {
    console.log(clc.xterm(175)('[Downloader - Epub Reader] getDataFromFFEpub()'));
    return new Promise(async function (resolve, reject) {
        // console.log('data:',data)
        let $ = cheerio.load(data);

        let fanfic = {}, tags = [], freeforms = [], characters = [], relationships = [];
        let isChaptersAttr = false, isGnere = false, ischaractersTags = false, isLanguage = false;
        let todayDate = new Date();

        fanfic["LastUpdateOfNote"] = todayDate.getTime();

        fanfic.FandomName = fandomName;
        fanfic.Source = 'FF';

        fanfic.FanficID = Number($('div a').attr('href').split('/s/')[1]);
        fanfic.URL = $('div a').attr('href');
        fanfic.FanficTitle = $('h1').text();

        fanfic.Author = $('h3 i').text().replace('by ', '');
        fanfic.AuthorURL = $('div a').attr('href').replace('/s/', '/u/');

        fanfic.Description = $('div div div').text();

        if (fandomName === 'SwanQueen') {
            fanfic.FandomsTags = ["Once Upon a Time"];
        }

        $('div div span').text().split(' - ').forEach(attr => {
            if (attr.includes('Rated:')) {
                fanfic.Rating = getRating(attr.replace('Rated: ', ''));
            } else if (attr.includes('Chapters:')) {
                fanfic.NumberOfChapters = Number(attr.split(': ')[1].replace(' ', ''));
                isChaptersAttr = true;
                fanfic.Oneshot = false;
            } else if (!isChaptersAttr && !isGnere && !ischaractersTags && !isLanguage) {
                fanfic.Language = attr;
                isLanguage = true;
            } else if (isLanguage && !isChaptersAttr && !isGnere && !ischaractersTags) {
                attr.split('/').forEach(tag => {
                    freeforms.push(tag)
                });
                freeforms.length > 0 && tags.push({ 'tags': freeforms });
                isGnere = true;
            } else if (isLanguage && !isChaptersAttr && isGnere && !ischaractersTags) {
                if (attr.includes(']')) {
                    attr.split('] ').forEach(tag => {
                        if (tag.includes('[') || tag.includes(']')) {
                            relationships.push(tag.replace('[', '').replace(']', '').replace(',', '/'))
                        } else {
                            tag.split(',').forEach(subtag => {
                                characters.push(subtag)
                            });
                        }
                    });
                } else {
                    attr.split(',').forEach(tag => {
                        characters.push(tag)
                    });
                }
                characters.length > 0 && tags.push({ 'characters': characters });
                relationships.length > 0 && tags.push({ 'relationships': relationships });
                ischaractersTags = true;
            } else if (attr.includes('Words:')) {
                fanfic.Words = Number(attr.split(': ')[1].replace(',', ''));
            } else if (attr.includes('Reviews:')) {
                fanfic.Comments = Number(attr.split(': ')[1].replace(' ', '').replace(',', ''));
            } else if (attr.includes('Favs:')) {
                fanfic.Kudos = Number(attr.split(': ')[1].replace(' ', '').replace(',', ''));
            } else if (attr.includes('Follows:')) {
                fanfic.Bookmarks = Number(attr.split(': ')[1].replace(' ', '').replace(',', ''));
                // } else if (attr.includes('id:')) {
                //     fanfic.FanficID = Number(attr.split(': ')[1].replace(' ', ''));
            } else if (attr.includes('Complete')) {
                fanfic.Complete = true;
            } else if (attr.includes('Published')) {
                fanfic.PublishDate = Number(new Date($('div div span span').first().text().trim()).getTime())
            } else if (attr.includes('Updated')) {
                fanfic.LastUpdateOfFic = Number(new Date($('div div span span').last().text().trim()).getTime())
            }

        });

        fanfic.LastUpdateOfFic = fanfic.LastUpdateOfFic ? fanfic.LastUpdateOfFic : fanfic.PublishDate;
        fanfic.LastUpdateOfNote = new Date().getTime();
        fanfic.Deleted = deleted;
        fanfic.Tags = tags;

        resolve(fanfic)
    })
}


const getRating = rating => {
    switch (rating) {
        case 'Fiction  K+':
            return 'general';
            break;
        case 'Fiction  K':
            return 'general';
            break;
        case 'Fiction  T':
            return 'teen';
            break;
        case 'Fiction  M':
            return 'mature';
            break;
        default:
            return 'none';
            break;
    }
}