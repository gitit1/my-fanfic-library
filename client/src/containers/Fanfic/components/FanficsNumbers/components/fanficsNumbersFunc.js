import {deletedFanfics} from '../../../../Fandoms/components/functions';

export const fanficsNumbersFunc = (fandom,ignoredCount,listFlag,listName) => {
    let fanficsNumbers = {};
    if(!listFlag){   
        const ao3FanficsCount       = fandom['AO3'] ?  fandom['AO3'].FanficsInSite : 0
        const ffFanficsCount        = fandom['FF']  ?  fandom['FF'].FanficsInSite : 0
        
        const tumblrFanficsCount    = fandom['Tumblr'] ? fandom['Tumblr'].FanficsInSite : 0;
        const patreonFanficsCount   = fandom['Patreon'] ? fandom['Patreon'].FanficsInSite : 0;
        const wattpadFanficsCount   = fandom['Wattpad'] ? fandom['Wattpad'].FanficsInSite : 0;
        
        fanficsNumbers = {
                fanficsTotalCount:          fandom.FanficsInFandom,
                fanficsCurrentCount:        fandom.FanficsInFandom - ignoredCount,
                fanficsIgnoredCount:        ignoredCount ? ignoredCount : 0,
                ao3FanficsCount:            ao3FanficsCount,
                ffFanficsCount:             ffFanficsCount,
                patreonFanficsCount:        patreonFanficsCount,
                tumblrFanficsCount:         tumblrFanficsCount,
                wattpadFanficsCount:        wattpadFanficsCount,
                fanficsDeletedCount:        Number(deletedFanfics(fandom))
        };
    }else{
        const list = fandom.find(f => {
            return f.Name === listName;
        });
        const totalCount = list.Fanfics.length;

        fanficsNumbers = {
            fanficsTotalCount:      totalCount,
            fanficsCurrentCount:    totalCount,
            fanficsIgnoredCount:    0,
            ao3FanficsCount:        0,
            ffFanficsCount:         0,
            tumblrFanficsCount:     0,
            fanficsDeletedCount:    0,
        };
    }

    return fanficsNumbers;
};