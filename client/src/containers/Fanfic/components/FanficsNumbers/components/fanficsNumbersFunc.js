import {deletedFanfics} from '../../../../Fandoms/components/functions';

export const fanficsNumbersFunc = (fandom,ignoredCount) => {
    console.log('fandom!:',fandom)
    const AO3DeletedFanfics = fandom['AO3'].DeletedFanfics ? fandom['AO3'].DeletedFanfics : 0;
    const FFDeletedFanfics  = fandom['FF'].DeletedFanfics  ? fandom['FF'].DeletedFanfics : 0;

    let fanficsNumbers = {
            fanficsTotalCount:      fandom.FanficsInFandom,
            fanficsCurrentCount:    fandom.FanficsInFandom - ignoredCount,
            fanficsIgnoredCount:    ignoredCount ? ignoredCount : 0,
            ao3FanficsCount:        fandom['AO3'].FanficsInFandom-AO3DeletedFanfics,
            ffFanficsCount:         fandom['FF'].FanficsInFandom-FFDeletedFanfics,
            fanficsDeletedCount:    Number(deletedFanfics(fandom)) + fandom['Backup'].FanficsInFandom,
    };

    return fanficsNumbers;
};