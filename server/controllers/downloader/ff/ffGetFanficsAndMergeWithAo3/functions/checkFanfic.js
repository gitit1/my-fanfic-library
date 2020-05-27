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
        if (fanfic.NumberOfChapters===1 && fanfic.Complete) {
            fanfic.Oneshot = true
        }


        fanfic.Tags = tags;
        fanfic.Source = 'FF';
        fanfic.Status = 'new';
        fanfic.StatusDetails = 'new';
        fanfic.Deleted = false;

        const isFanficExsist = await funcs.checkForExactSimilar(fanfic, fandomName);

        const linkHasImage = !$('.stitle img').attr('data-original') ? false : `https:${$('.stitle img').attr('data-original').replace('/75/','/180/')}`;


        console.log(msgHeader(`---------------------- ${fanfic.Author} - ${fanfic.FanficTitle} ---------------------------`));
        if (isFanficExsist) {
            const exsistsFanfic = isFanficExsist[0];
            const { FanficID_FF, Source, Deleted, image, NumberOfChapters } = exsistsFanfic;
            
            const isLinkedToFF = FanficID_FF === undefined ? false : true;
            const isDeleted = Deleted === undefined ? false : Deleted;

            const hasImage = (image === undefined || image === '') ? false : true;
            const imageName = linkHasImage && fixStringForPath(`${fanfic.Author}_${fanfic.FanficTitle} (${exsistsFanfic.FanficID}).jpg`);
            const imagePath = linkHasImage && `public/fandoms/${fandomName.toLowerCase()}/fanficsImages/${imageName}`;

            const fileName = fixStringForPath(`${fanfic.Author}_${fanfic.FanficTitle} (${exsistsFanfic.FanficID})`);

            exsistsFanfic.Deleted = false; // TODO: remove after running on all fandoms

            if (!isLinkedToFF && Source === 'AO3') {
                // Exsist as ao3 but not have ff linked
                console.log(msg1(`-----Found Similar (Exist as AO3 but not linekd to FF): ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`));
                log.info(`-----Found Similar (Exist as AO3 but not linekd to FF): ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`);
               
                exsistsFanfic.FanficID_FF = fanfic.FanficID;
                exsistsFanfic.URL_FF = fanfic.URL;
                exsistsFanfic.AuthorURL_FF = fanfic.AuthorURL;
                exsistsFanfic.HasFFLink = true;

                exsistsFanfic.Status = 'update';
                exsistsFanfic.StatusDetails = 'old';
                // Check if ff is more updated
                if (fanfic.NumberOfChapters > NumberOfChapters) {
                    console.log(msg1(`----- FF is more updated - saving the data`));
                    exsistsFanfic.NumberOfChapters = fanfic.NumberOfChapters;
                    exsistsFanfic.Complete = fanfic.Complete;
                    exsistsFanfic.Words = fanfic.Words;
                    exsistsFanfic.PublishDate = fanfic.PublishDate;
                    exsistsFanfic.LastUpdateOfFic = fanfic.LastUpdateOfFic;
                    exsistsFanfic.LastUpdateOfNote = fanfic.LastUpdateOfNote;
                    await funcs.downloadFanfic(fanfic.URL, Source, fileName, 'epub', fandomName, exsistsFanfic.FanficID, collection);
                }
                // Add Image (if needed)
                if (!hasImage && linkHasImage) {
                    exsistsFanfic.image = imageName;
                    await funcs.downloadImageFromLink(linkHasImage, imagePath, function () { console.log('done'); });
                }
                // Update DB
                await funcs.saveFanficToDB(fandomName, exsistsFanfic, collection);
            } else if (isLinkedToFF && Source === 'AO3' && fanfic.NumberOfChapters > NumberOfChapters) {
                console.log(msg1(`-----Found Similar (Exist as AO3 && linekd to FF but FF is more updated): ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`));
                log.info(`-----Found Similar (Exist as AO3 && linekd to FF but FF is more updated): ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`);
                exsistsFanfic.NumberOfChapters = fanfic.NumberOfChapters;
                exsistsFanfic.Complete = fanfic.Complete;
                exsistsFanfic.Words = fanfic.Words;
                exsistsFanfic.PublishDate = fanfic.PublishDate;
                exsistsFanfic.LastUpdateOfFic = fanfic.LastUpdateOfFic;
                exsistsFanfic.LastUpdateOfNote = fanfic.LastUpdateOfNote;
                exsistsFanfic.Status = 'update';
                exsistsFanfic.StatusDetails = 'old';
                exsistsFanfic.HasFFLink = true;

                // Add Image (if needed)
                if (!hasImage && linkHasImage) {
                    exsistsFanfic.image = imageName;
                    await funcs.downloadImageFromLink(linkHasImage, imagePath, function () { console.log('done'); });
                }
                // Update DB
                await funcs.saveFanficToDB(fandomName, exsistsFanfic, collection);
                await funcs.downloadFanfic(fanfic.URL, Source, fileName, 'epub', fandomName, exsistsFanfic.FanficID, collection);
            } else if (isLinkedToFF && !isDeleted && !hasImage && linkHasImage && Source === 'AO3') {
                // Exsist with ao3 with linked ff but with no image (and ff has image)
                console.log(msg2(`-----Found Similar (Exsist with ao3 with linked ff but with no image): ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`));
                log.info(`-----Found Similar (Exsist with ao3 with linked ff but with no image): ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`);
                // Add Image 
                exsistsFanfic.image = imageName;
                await funcs.downloadImageFromLink(linkHasImage, imagePath, function () { console.log('done'); });
                // Update DB
                exsistsFanfic.Status = 'update';
                exsistsFanfic.StatusDetails = 'image';
                exsistsFanfic.HasFFLink = true;
                await funcs.saveFanficToDB(fandomName, exsistsFanfic, collection);
            } else if (isLinkedToFF && isDeleted && Source === 'AO3') {
                // Exsist as ao3 with ff but deleted from ao3 
                console.log(msg3(`-----Found Similar (Exsist as ao3 with ff but deleted from ao3): ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`));
                log.info(`-----Found Similar (Exsist as ao3 with ff but deleted from ao3 ): ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`);
                exsistsFanfic.Deleted = false;
                exsistsFanfic.Status = 'update';
                exsistsFanfic.StatusDetails = 'not deleted';
                exsistsFanfic.HasFFLink = true;
                // Add Image (if needed)
                if (!hasImage && linkHasImage) {
                    exsistsFanfic.image = imageName;
                    await funcs.downloadImageFromLink(linkHasImage, imagePath, function () { console.log('done'); });
                }
                // Update DB
                await funcs.saveFanficToDB(fandomName, exsistsFanfic);
            } else if (Source === 'FF' && !hasImage && linkHasImage) {
                // Exsist as ff without image (and ff has image)
                console.log(msg4(`-----Found Similar (Exsist as ff without image (and ff has image)): ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`));
                log.info(`-----Found Similar (Exsist as ff without image (and ff has image)): ${exsistsFanfic.FanficID} , FF_ID: ${fanfic.FanficID}`);
                exsistsFanfic.URL_FF = fanfic.URL;
                exsistsFanfic.AuthorURL_FF = fanfic.AuthorURL;
                // Add Image 
                exsistsFanfic.image = imageName;
                exsistsFanfic.Status = 'update';
                exsistsFanfic.StatusDetails = 'old';
                await funcs.downloadImageFromLink(linkHasImage, imagePath, function () { console.log('done'); });
                // Update DB
                await funcs.saveFanficToDB(fandomName, exsistsFanfic, collection);
                // Fanfic is not saved
                if (!exsistsFanfic.SavedFic || exsistsFanfic.NeedToSaveFlag) {
                    console.log('Fanfic is not saved.. going to save it')
                    await funcs.downloadFanfic(fanfic.URL, fanfic.Source, fileName, 'epub', fandomName, fanfic.FanficID, collection);
                }
            } else if (Source === 'FF') {
                console.log(msg5(`-----Found Similar - FF fanfic: ${exsistsFanfic.FanficID}`));
                log.info(`-----Found Similar - FF fanfic: ${exsistsFanfic.FanficID}`);
                exsistsFanfic.NumberOfChapters = fanfic.NumberOfChapters;
                exsistsFanfic.Complete = fanfic.Complete;
                exsistsFanfic.Words = fanfic.Words;
                exsistsFanfic.PublishDate = fanfic.PublishDate;
                exsistsFanfic.LastUpdateOfFic = fanfic.LastUpdateOfFic;
                exsistsFanfic.LastUpdateOfNote = fanfic.LastUpdateOfNote;
                exsistsFanfic.Comments = fanfic.Comments
                exsistsFanfic.Kudos = fanfic.Kudos
                exsistsFanfic.Bookmarks = fanfic.Bookmarks
                exsistsFanfic.Description = fanfic.Description
                exsistsFanfic.Tags = fanfic.Tags
                exsistsFanfic.Status = 'old';
                exsistsFanfic.StatusDetails = 'old';
                await funcs.saveFanficToDB(fandomName, exsistsFanfic, collection);
                // Fanfic is not saved
                if (!exsistsFanfic.SavedFic || exsistsFanfic.NeedToSaveFlag) {
                    console.log('Fanfic is not saved.. going to save it')
                    await funcs.downloadFanfic(fanfic.URL, fanfic.Source, fileName, 'epub', fandomName, fanfic.FanficID, collection);
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
                await funcs.downloadImageFromLink(linkHasImage, imagePath, function () { console.log('done'); });
            }
            const status = await funcs.saveFanficToDB(fandomName, fanfic, collection);
            status && await funcs.updateFandomDataInDB(fanfic);
            await funcs.downloadFanfic(fanfic.URL, fanfic.Source, fileName, 'epub', fandomName, fanfic.FanficID, collection);
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