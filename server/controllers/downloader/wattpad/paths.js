const clc = require("cli-color");
const fs = require('fs');

const getAllFolders = (path) => {
    console.log(clc.greenBright('[WPD] getAllAuthorsFolders()'));
    return new Promise(async function (resolve, reject) {
        resolve(fs.readdirSync(path, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name));
    });
}

const getAllFanficsFolders = (mainPath, authorsFolders) => {
    console.log(clc.greenBright('[WPD] getAllFanficsFolders()'));
    let fanficsPathsArray = [];
    return new Promise(async function (resolve, reject) {
        await authorsFolders.forEach(authorPath => {
            getAllFolders(`${mainPath}/${authorPath}`).then(fanficsPath => {
                fanficsPath.map(fanficName => {
                    fanficsPathsArray.push(`${mainPath}/${authorPath}/${fanficName}`)
                });
            })
        });
        resolve(fanficsPathsArray);
    });
}

const getEpubPaths = async (fanficsFolders) => {
    epubsPaths = [], promises = [];
    
    return new Promise(async function(resolve, reject) {
        fanficsFolders.forEach(fanficFolder => {
            promises.push(getFilesFromFolder(fanficFolder));
        });
    
        await Promise.all(promises).then(async epubsPaths => {
            resolve(epubsPaths);
        });
    });
}

const getFilesFromFolder = (path) => {
    console.log(clc.xterm(175)('[WPD] getFilesFromFolder()'));
    return new Promise(async function (resolve, reject) {
        fs.readdir(path, (err, files) => {
            files.forEach(file => {
                if (file.includes(".epub")) {
                    resolve([path, `${path}/${file}`])
                }
            });
        });
    });
}

exports.getPaths = async (mainPath) => {
    console.log(clc.xterm(175)('[WPD] getPaths()'));
    return new Promise(async function (resolve, reject) {
        const authorsFolders = await getAllFolders(mainPath);
        const fanficsFolders = await getAllFanficsFolders(mainPath, authorsFolders);
        const epubPaths = await getEpubPaths(fanficsFolders);
        resolve(epubPaths);
    });
}