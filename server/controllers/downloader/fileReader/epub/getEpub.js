
const multer = require('multer');
const { readEpub } = require('./readEpub.js');
const { fixStringForPath } = require('../../../helpers/fixStringForPath.js');
const funcs = require('../../helpers/index');
const keys = require("../../../../config/keys");

exports.getEpub = async (fandomName, filetype, fileName, req, res) => {
    return await new Promise(async function (resolve, reject) {
        console.log('in readFromEpub');

        fandomName = fandomName.replace("%26", "&").toLowerCase();
        const tempPath = `public/temp-files`;


        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, tempPath)
            },
            filename: function (req, file, cb) {
                cb(null, fixStringForPath(file.fieldname))
            }
        });

        let upload = multer({ storage: storage }).any();

        await upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.log('Muller Error', res.status(500).json(err));
                resultMessage = 'Error';
                return resultMessage;
            } else if (err) {
                console.log('Other Error', err);
                resultMessage = 'Other Error';
                return resultMessage;
            }

            keys.nodeEnv !== 'development' && await funcs.delay(8000);
            await readEpub(fandomName, `${tempPath}/${fileName}.${filetype}`).then(async fanfic => {
                const checkForSimilarResult = await funcs.checkForSimilar(fanfic, fandomName);
    
                if (!checkForSimilarResult) {
                    return resolve([fanfic])
                } else {
                    return resolve([fanfic, checkForSimilarResult[0]])
                }
    
            })
        })

    });
}
