const FandomModal = require('../../../../models/Fandom');

exports.updateFandomDataInDB = async (fanfic) => {
    console.log('[Downloader] - updateFandomData')
    const fandomName = fanfic.FandomName;
    const isComplete = fanfic.Complete ? `${fanfic.Source}.CompleteFanfics` : `${fanfic.Source}.OnGoingFanfics`
    const sourceFanficsInFandom = `${fanfic.Source}.FanficsInFandom`;
    const sourceSavedFanfics = `${fanfic.Source}.SavedFanfics`;
    await FandomModal.updateOne({ 'FandomName': fandomName },
        {
            $inc: {
                'FanficsInFandom': 1,
                [sourceFanficsInFandom]: 1,
                [isComplete]: 1,
                [sourceSavedFanfics]: 1
            },
        });

    return null;
}