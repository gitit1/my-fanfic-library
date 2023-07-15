const clc = require("cli-color");
const FandomUserData = require('../../../../models/UserData');
const { addActivityToUserActivities } = require('../addActivityToUserActivities');

exports.deleteFanficFromReadingList = async (req, res) => {
    console.log(clc.xterm(175)('[db controller] deleteFanficFromReadingList()'));
    const { userEmail, fanficId, name, author, fanficTitle, fandomName, source } = req.query;

    FandomUserData.findOne({ userEmail: userEmail }, async function (err, user) {
        if (err) { return 'there is an error'; }

        if (user) {
            console.log('found user!!, ' + user.userEmail)
            console.log('name!!, ' + name)
            let userFanficData = await user.FanficList.find(x => x.FanficID === Number(fanficId));
            console.log('userFanficData 1:', userFanficData)
            userFanficData = userFanficData.ReadingList.filter(e => e !== name);
            console.log('userFanficData:', userFanficData)

            FandomUserData.updateOne(
                { userEmail: userEmail, "FanficList.FanficID": fanficId },
                { $set: { "FanficList.$.Date": new Date().getTime(), "FanficList.$.ReadingList": userFanficData } },
                async (err, result) => {
                    if (err) throw err;
                    console.log('User updated!');
                    await addActivityToUserActivities(userEmail, fanficId, author, fanficTitle, fandomName, source, 'Reading List', 'false', name)
                    FandomUserData.updateOne(
                        { userEmail: userEmail, "ReadingList.$.Name": name },
                        { $pull: { "ReadingList.$.Fanfics": fanficId } },
                        async (err, result) => {
                            if (err) throw err;
                            console.log('ReadingList updated!');
                            res.send(true);
                        }
                    )
                }
            );
        } else {
            console.log('didnt found user , creating new one!!')
            res.send(false);
        }
    })
}

