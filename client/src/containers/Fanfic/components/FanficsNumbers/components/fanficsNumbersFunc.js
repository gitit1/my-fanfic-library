import {deletedFanfics} from '../../../../Fandoms/components/functions';

export const fanficsNumbersFunc = (fandom,ignoredCount) => {
    const AO3DeletedFanfics = fandom.AO3DeletedFanfics ? fandom.AO3DeletedFanfics : 0;
    const FFDeletedFanfics  = fandom.FFDeletedFanfics  ? fandom.FFDeletedFanfics : 0;

    let fanficsNumbers = {
            fanficsTotalCount:      fandom.FanficsInFandom,
            fanficsCurrentCount:    fandom.FanficsInFandom - ignoredCount,
            fanficsIgnoredCount:    ignoredCount ? ignoredCount : 0,
            ao3FanficsCount:        fandom.AO3FanficsInFandom-AO3DeletedFanfics,
            ffFanficsCount:         fandom.FFFanficsInFandom-FFDeletedFanfics,
            fanficsDeletedCount:    Number(deletedFanfics(fandom)),
    };

    return fanficsNumbers;
};