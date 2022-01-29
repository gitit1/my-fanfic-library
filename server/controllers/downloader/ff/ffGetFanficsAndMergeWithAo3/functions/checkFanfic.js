const cheerio = require('cheerio');
const clc = require("cli-color");
const funcs = require('../../../helpers/index');
const { fixStringForPath } = require('../../../../helpers/fixStringForPath')

const msgHeader = clc.xterm(55).bgXterm(254);
const msg1 = clc.xterm(17).bgXterm(254);
const msg2 = clc.xterm(18).bgXterm(254);
const msg3 = clc.xterm(19).bgXterm(254);
const msg4 = clc.xterm(20).bgXterm(254);
const msg5 = clc.xterm(21).bgXterm(254);
const msg6 = clc.xterm(39).bgXterm(254);

exports.checkFanfic = async (log, data, fandomName, collection) => {
    return new Promise(async function (resolve, reject) {

        let fanfic = {}, tags = [], freeforms = [], characters = [], relationships = [];
        let isChaptersAttr = false, isGnere = false, ischaractersTags = false, isLanguage = false;

        let $ = cheerio.load(data)

        fanfic.FandomName = fandomName;
        fanfic.FanficTitle = $('.stitle').text().trim();
        fanfic.URL = `https://www.fanfiction.net${$('.stitle').attr('href')}`;
        fanfic.Author = $('a').eq(2).text().trim();
        fanfic.Author = (fanfic.Author === 'reviews' || fanfic.Author === '') ? $('a').eq(1).text().trim() : fanfic.Author;
        fanfic.AuthorURL = `www.fanfiction.net${$('a').eq(1).attr('href')}`;
        fanfic.FanficID = Number(fanfic.URL.split('/1/')[0].split('/s/')[1]);

        fanfic.LastUpdateOfFic = Number($('.xgray span').first().attr('data-xutime') + '000');
        fanfic.PublishDate = (!$('.xgray span').last().attr('data-xutime')) ? fanfic.LastUpdateOfFic : Number($('.xgray span').last().attr('data-xutime') + '000');
        fanfic.LastUpdateOfNote = new Date().getTime();

        $('.xgray').text().split(' - ').forEach(attr => {
            if (attr.includes('Rated:')) {
                fanfic.Rating = getRating(attr);
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
                // }
            } else if (attr.includes('Complete')) {
                fanfic.Complete = true;
            }
        });

        fanfic.Description = $('.z-padtop').children().remove().end().text().trim();
        if (!fanfic.Complete) {
            fanfic.Complete = false;
        }
        if (!fanfic.NumberOfChapters && fanfic.Complete) {
            fanfic.NumberOfChapters = 1
            fanfic.Oneshot = true
        }
        if (fanfic.NumberOfChapters === 1 && fanfic.Complete) {
            fanfic.Oneshot = true
        }

        fanfic.Tags = tags;
        fanfic.Source = 'FF';
        fanfic.Status = 'new';
        fanfic.StatusDetails = 'new';
        fanfic.Deleted = false;

        console.log(msgHeader(`---------------------- ${fanfic.Author} - ${fanfic.FanficTitle} ---------------------------`));
        const isFanficExsist = await funcs.checkForSimilarForMergeWithFF(fanfic, fandomName, collection);
        const linkHasImage = !$('.stitle img').attr('data-original') ? false : `https://www.fanfiction.net${$('.stitle img').attr('data-original').replace('/75/', '/180/')}test.jpg`;

        if (isFanficExsist) {
            const exsistsFanfic = isFanficExsist[0];
            const { FanficID_FF, Source, Deleted, image, NumberOfChapters, Complete } = exsistsFanfic;

            const isLinkedToFF = FanficID_FF === undefined ? false : true;
            const isDeleted = Deleted === undefined ? false : Deleted;

            const hasImage = (image === undefined || image === '') ? false : true;
            const imageName = linkHasImage && fixStringForPath(`${fanfic.Author}_${fanfic.FanficTitle} (${exsistsFanfic.FanficID}).jpg`);
            const imagePath = linkHasImage && `public/fandoms/${fandomName.toLowerCase()}/fanficsImages/${imageName}`;

            const fileName = fixStringForPath(`${fanfic.Author}_${fanfic.FanficTitle} (${exsistsFanfic.FanficID})`);

            exsistsFanfic.Deleted = false;
            if (Source === 'AO3') {
                console.log(msg1(`-----Found Similar In AO3: ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`));
                log.info(`-----Found Similar In AO3: ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`);
                // Check if fanfic is not linked to ff
                if (!isLinkedToFF) {
                    console.log(msg2(`!!!!! was not linked to FF, Linking it now...`));
                    log.info(`!!!!! was not linked to FF, Linking it now...`);
                    exsistsFanfic.FanficID_FF = fanfic.FanficID;
                    exsistsFanfic.URL_FF = fanfic.URL;
                    exsistsFanfic.AuthorURL_FF = fanfic.AuthorURL;
                    exsistsFanfic.HasFFLink = true;
                }
                // Check if ff is more updated
                if ((fanfic.NumberOfChapters > NumberOfChapters) && !Complete) {
                    console.log(msg3(`!!!!! FF is more updated - saving the data...`));
                    log.info(`!!!!! FF is more updated - saving the data...`);
                    exsistsFanfic.NumberOfChapters = fanfic.NumberOfChapters;
                    exsistsFanfic.Complete = fanfic.Complete;
                    exsistsFanfic.Words = fanfic.Words;
                    exsistsFanfic.PublishDate = fanfic.PublishDate;
                    exsistsFanfic.LastUpdateOfFic = fanfic.LastUpdateOfFic;
                    exsistsFanfic.Status = 'update';
                    exsistsFanfic.StatusDetails = 'old';
                    // await funcs.downloadFanfic(fanfic.URL, Source, fileName, 'epub', fandomName, exsistsFanfic.FanficID, collection);
                    await funcs.downloadFFFanficNew(fandomName, fanfic.FanficID, fileName) 
                }
                // Add Image (if needed)
                if (!hasImage && linkHasImage) {
                    console.log(msg4(`!!!!! Exsist with ao3 with linked ff but with no image - getting FF image...`));
                    log.info(`!!!!! Exsist with ao3 with linked ff but with no image - getting FF image...`);
                    exsistsFanfic.image = imageName;
                    exsistsFanfic.Status = 'update';
                    exsistsFanfic.StatusDetails = 'image';
                    await funcs.downloadImageFromLink(linkHasImage, imagePath);
                }
                if (isDeleted) {
                    console.log(msg5(`!!!!! Found Deleted from ao3 but not from FF`));
                    log.info(`!!!!! Found Deleted from ao3 but not from FF`);
                    exsistsFanfic.Deleted = false;
                    exsistsFanfic.Status = 'update';
                    exsistsFanfic.StatusDetails = 'not deleted';
                }

                exsistsFanfic.LastUpdateOfNote = fanfic.LastUpdateOfNote;
                exsistsFanfic.Comments = (exsistsFanfic.Comments < fanfic.Comments) ? fanfic.Comments : exsistsFanfic.Comments;
                exsistsFanfic.Kudos = (exsistsFanfic.Kudos < fanfic.Kudos) ? fanfic.Kudos : exsistsFanfic.Kudos;
                exsistsFanfic.Bookmarks = (exsistsFanfic.Bookmarks < fanfic.Bookmarks) ? fanfic.Bookmarks : exsistsFanfic.Bookmarks;

                // Update DB
                await funcs.saveFanficToDB(fandomName, exsistsFanfic, collection);
            } else if (Source === 'FF') {
                console.log(msg5(`-----Found Similar - FF fanfic: ${exsistsFanfic.FanficID}`));
                log.info(`-----Found Similar - FF fanfic: ${exsistsFanfic.FanficID}`);

                if (!hasImage && linkHasImage) {
                    exsistsFanfic.image = imageName;
                    exsistsFanfic.Status = 'update';
                    await funcs.downloadImageFromLink(linkHasImage, imagePath);
                }
                exsistsFanfic.FanficTitle = fanfic.FanficTitle;
                exsistsFanfic.URL = fanfic.URL;
                exsistsFanfic.Author = fanfic.Author;
                exsistsFanfic.AuthorURL = fanfic.AuthorURL;
                exsistsFanfic.Rating = fanfic.Rating;
                exsistsFanfic.Tags = fanfic.Tags;
                exsistsFanfic.Language = fanfic.Language;
                exsistsFanfic.Kudos = fanfic.Kudos;
                exsistsFanfic.Comments = fanfic.Comments;
                exsistsFanfic.Bookmarks = fanfic.Bookmarks;
                exsistsFanfic.Words = fanfic.Words;
                exsistsFanfic.Description = fanfic.Description;
                exsistsFanfic.Oneshot = fanfic.Oneshot;

                exsistsFanfic.PublishDate = fanfic.PublishDate;
                exsistsFanfic.LastUpdateOfFic = fanfic.LastUpdateOfFic;
                exsistsFanfic.LastUpdateOfNote = fanfic.LastUpdateOfNote;
                exsistsFanfic.Status = 'old';
                exsistsFanfic.StatusDetails = 'old';
                // Fanfic is not saved/updated
                if ((exsistsFanfic.NumberOfChapters < fanfic.NumberOfChapters) ||
                    (exsistsFanfic.Complete !== fanfic.Complete) ||
                    !exsistsFanfic.SavedFic ||
                    exsistsFanfic.NeedToSaveFlag) {
                    exsistsFanfic.NumberOfChapters = fanfic.NumberOfChapters;
                    exsistsFanfic.Complete = fanfic.Complete;
                    exsistsFanfic.Status = 'updated';
                    console.log('Fanfic got updated or is not saved.. going to save it');
                    // await funcs.downloadFanfic(fanfic.URL, fanfic.Source, fileName, 'epub', fandomName, fanfic.FanficID, collection);
                    const downloading = await funcs.downloadFFFanficNew(fandomName, fanfic.FanficID, fileName);
                    if(downloading === 0){
                        exsistsFanfic.SavedFic = true;
                    }
                    await funcs.saveFanficToDB(fandomName, exsistsFanfic, collection);
                } else {
                    await funcs.saveFanficToDB(fandomName, exsistsFanfic, collection);
                }
            }
        } else {
            // Not exsist
            const imageName = linkHasImage && fixStringForPath(`${fanfic.Author}_${fanfic.FanficTitle} (${fanfic.FanficID}).jpg`);
            const imagePath = linkHasImage && `public/fandoms/${fandomName.toLowerCase()}/fanficsImages/${imageName}`;
            const fileName = fixStringForPath(`${fanfic.Author}_${fanfic.FanficTitle} (${fanfic.FanficID})`);
            console.log(msg6(`-----Adding new Fanfic: ${fanfic.FanficID}`));
            log.info(`-----Adding new Fanfic: ${fanfic.FanficID}`);
            if (linkHasImage) {
                fanfic.image = imageName;
                await funcs.downloadImageFromLink(linkHasImage, imagePath);
            }
            const downloading = await funcs.downloadFFFanficNew(fandomName, fanfic.FanficID, fileName);
            if(downloading === 0){
                fanfic.SavedFic = true;
            }

            const status = await funcs.saveFanficToDB(fandomName, fanfic, collection);
            status && await funcs.updateFandomDataInDB(fanfic);
            // await funcs.downloadFanfic(fanfic.URL, fanfic.Source, fileName, 'epub', fandomName, fanfic.FanficID, collection);
        }
        console.log(msgHeader('-------------------------------------------------------------------------------------------'));
        resolve()
    });
}

const getRating = rating => {
    switch (rating) {
        case 'Rated: K+':
            return 'general';
        case 'Rated: K':
            return 'general';
        case 'Rated: T':
            return 'teen';
        case 'Rated: M':
            return 'mature';
        default:
            return 'none';
    }
}