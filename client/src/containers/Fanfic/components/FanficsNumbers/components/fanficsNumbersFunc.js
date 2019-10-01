import {deletedFanfics} from '../../../../Fandoms/components/functions';

export const fanficsNumbersFunc = (fandom,ignoredCount,listFlag,listName) => {
    console.log('fandom:::',fandom)
    console.log('ignoredCount:::',ignoredCount)
    console.log('list:::',listFlag)
    let fanficsNumbers = {};
    if(!listFlag){
        const AO3DeletedFanfics     = fandom['AO3'] && fandom['AO3'].DeletedFanfics ? fandom['AO3'].DeletedFanfics : 0;
        const FFDeletedFanfics      = fandom['FF'] && fandom['FF'].DeletedFanfics  ? fandom['FF'].DeletedFanfics : 0;
    
        const ao3FanficsCount       = fandom['AO3'] ?  fandom['AO3'].FanficsInFandom-AO3DeletedFanfics : 0
        const ffFanficsCount        = fandom['FF']  ?  fandom['FF'].FanficsInFandom-FFDeletedFanfics : 0
        
        const tumblrFanficsCount    = fandom['Tumblr'] ? fandom['Tumblr'].FanficsInFandom : 0;
        const patreonFanficsCount   = fandom['Patreon'] ? fandom['Patreon'].FanficsInFandom : 0;
        const wattpadFanficsCount   = fandom['Wattpad'] ? fandom['Wattpad'].FanficsInFandom : 0;
        const backup                = fandom['Backup'] ? fandom['Backup'].FanficsInFandom : 0;
        
        fanficsNumbers = {
                fanficsTotalCount:          fandom.FanficsInFandom,
                fanficsCurrentCount:        fandom.FanficsInFandom - ignoredCount,
                fanficsIgnoredCount:        ignoredCount ? ignoredCount : 0,
                ao3FanficsCount:            ao3FanficsCount,
                ffFanficsCount:             ffFanficsCount,
                patreonFanficsCount:        patreonFanficsCount,
                tumblrFanficsCount:         tumblrFanficsCount,
                wattpadFanficsCount:        wattpadFanficsCount,
                fanficsDeletedCount:        Number(deletedFanfics(fandom)) + backup,
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