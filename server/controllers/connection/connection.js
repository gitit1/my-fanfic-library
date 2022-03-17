
const clc = require("cli-color");
const funcs = require('./functions/index')
const logger = require('simple-node-logger');
const { fetchFandoms } = require("../helpers/fetchFandoms.js");

exports.manageDownloader = async (socket, fandom, choice, callType, ao3, ff, from, to) => {
    console.log(clc.xterm(175)('[connection] manageDownloader'));
    let log, log2;

    const opts = {
        logDirectory: `public/logs/downloader`,
        fileNamePattern: callType === 'site' ? `<DATE>-manually-${choice}.log` : `<DATE>-cron-${choice}.log`,
        dateFormat: 'YYYY.MM.DD'
    };
    log = logger.createRollingFileLogger(opts);
    if (fandom !== 'All') {
        const opts2 = {
            logDirectory: `public/logs/downloader/duplicate-titles`,
            fileNamePattern: `<DATE>-${fandom.FandomName}.log`,
            dateFormat: 'YYYY.MM.DD'
        };
        log2 = logger.createRollingFileLogger(opts2);
    }

    try {
        if (fandom === 'All') {
            let allFandoms = await fetchFandoms(), promises = [];
            if (allFandoms) {
                let p = Promise.resolve();
                switch (choice) {
                    case 'getFandomFanficsPartial':
                        await allFandoms.map(async fandom => promises.push(
                            await new Promise(resolve => setTimeout(resolve, 30000)),
                            p = p.then(() => funcs.getFandomFanfics(socket, log, fandom, 'partial', ao3, ff, from, to))
                        ))
                        break;
                    case 'getFandomFanficsFull':
                        await allFandoms.map(async fandom => promises.push(
                            await new Promise(resolve => setTimeout(resolve, 30000)),
                            p = p.then(() => funcs.getFandomFanfics(socket, log, fandom, 'full', ao3, ff, from, to))
                        ))
                        break;
                    case 'getDeletedFanfics':
                        await allFandoms.map(async fandom => promises.push(
                            await new Promise(resolve => setTimeout(resolve, 30000)),
                            p = p.then(() => funcs.getDeletedFanfics(socket, log, fandom))
                        ))
                        break;
                    case 'updateFandomNumbers':
                        await allFandoms.map(async fandom => promises.push(
                            await new Promise(resolve => setTimeout(resolve, 30000)),
                            p = p.then(() => funcs.updateFandomNumbers(socket, fandom, ao3, ff))
                        ))
                        break;
                }

                return null;

            } else {
                console.log(clc.cyanBright(`Server got error in manageDownloader`));
                socket && socket.emit('getFanficsData', `<span style="color:red"><b>Server got error in manageDownloader</b></span>`);
                return null;
            }


        } else {
            switch (choice) {
                case 'getFandomFanficsPartial':
                    await funcs.getFandomFanfics(socket, log, fandom, 'partial', ao3, ff, from, to)
                    break;
                case 'getFandomFanficsFull':
                    await funcs.getFandomFanfics(socket, log, fandom, 'full', ao3, ff, from, to)
                    break;
                case 'getDeletedFanfics':
                    await funcs.getDeletedFanfics(socket, log, fandom)
                    break;
                case 'updateFandomNumbers':
                    await funcs.updateFandomNumbers(socket, fandom, ao3, ff)
                    break;
                case 'handleDuplicateTitles':
                    await funcs.handleDuplicateTitles(socket, log2, fandom)
                    break;
            }

        }

        return null
    } catch (e) {
        console.log(e);
    }
}
