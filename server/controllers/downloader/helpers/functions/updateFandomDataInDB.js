const FandomModal = require('../../../../models/Fandom');

exports.updateFandomDataInDB = async (fanfic) => {
    console.log('[Downloader] - updateFandomData')
    const fandomName = fanfic.FandomName;
    const isComplete = fanfic.Complete ? `${fanfic.Source}.CompleteFanfics` : `${fanfic.Source}.OnGoingFanfics`
    const sourceTotalFanficsInFandom = `${fanfic.Source}.TotalFanficsInFandom`;
    const sourceFanficsInSite = `${fanfic.Source}.FanficsInSite`;
    const sourceSavedFanfics = `${fanfic.Source}.SavedFanfics`;
    await FandomModal.updateOne({ 'FandomName': fandomName },
        {
            $inc: {
                'FanficsInFandom': 1,
                [sourceTotalFanficsInFandom]: 1,
                [sourceFanficsInSite]: 1,
                [isComplete]: 1,
                [sourceSavedFanfics]: 1
            },
        });

    return null;
}