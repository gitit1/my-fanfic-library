const clc = require("cli-color");

const { checkForUserDataInDBOnCurrentFanfics } = require('../../helpers/checkForUserDataInDBOnCurrentFanfics')
const { getFanfics } = require('../../helpers/getFanfics')
const { getIgnoredList } = require('../../helpers/getIgnoredList');
const { getReadingLists } = require('../../helpers/getReadingLists');

exports.getFanficsFromDB = async (req, res) => {
    console.log(clc.blue('[db controller] getFanficsFromDB()'));
    let { FandomName, skip, limit, userEmail, list } = req.query, userData = [], ignoreList;
    skip = Number(skip); limit = Number(limit);
    const sort = null;

    ignoreList = await getIgnoredList(FandomName, userEmail);
    readingLists = await getReadingLists(userEmail);
    let filters = {}, readingList = null;
    const hasIgnoreList = ignoreList.length > 0 ? true : false;

    if (list === 'true') {
        readingList = readingLists[1].find(f => {
            return f.Name === FandomName;
        });
        filters = hasIgnoreList ? { FanficID: { $nin: ignoreList }, FanficID: { $in: readingList.Fanfics } } : { FanficID: { $in: readingList.Fanfics } }
    } else {
        filters = hasIgnoreList ? { FanficID: { $nin: ignoreList } } : null;
    }

    getFanfics(skip, limit, FandomName, filters, sort, list, readingList).then(async fanfics => {
        if (userEmail != 'null') {
            userData = await checkForUserDataInDBOnCurrentFanfics(userEmail, fanfics)
            res.send([fanfics, userData, readingLists[0], ignoreList.length])
        } else {
            res.send([fanfics, [], [], 0])
        }
    })
}

