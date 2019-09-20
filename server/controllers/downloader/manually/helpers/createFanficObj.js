exports.createFanficObj = async (fandomName,fanficData) =>{
    return await new Promise(async function(resolve, reject) {
            fanfic = {
                FandomName:         fandomName,
                FanficID:           Number(fanficData.FanficID),
                FanficTitle:        fanficData.FanficTitle,
                Author:             fanficData.Author,
                AuthorURL:          '',
                Source:             fanficData.Source,
                NumberOfChapters:   Number(fanficData.NumberOfChapters),
                Complete:           fanficData.Complete==='true' ? true : false,
                Oneshot:            fanficData.Oneshot==='true' ? true : false,
                URL:                '',
                Rating:             fanficData.Rating,
                PublishDate:        Number(fanficData.PublishDate),
                LastUpdateOfFic:    Number(fanficData.UpdateDate),
                Tags:               [
                                        fanficData.Warnings!=='' ? {warnings:fanficData.Warnings.split(',')} : undefined,
                                        fanficData.Relationships!=='' ? {relationships:fanficData.Relationships.split(',')} : undefined,
                                        fanficData.Characters!=='' ? {characters:fanficData.Characters.split(',')} : undefined,
                                        fanficData.Tags!=='' ? {tags:fanficData.Tags.split(',')} : undefined
                                    ].filter(x => x !== undefined),
                FandomsTag:         fanficData.FandomsTags!=='' ? fanficData.FandomsTags.split(',') : null,
                Categories:         fanficData.Categories!=='' ? fanficData.Categories.split(',') : null,
                Description:        fanficData.Summary,
                Language:           fanficData.Language,
                Words:              Number(fanficData.Words),   
                NumberOfChapters:   Number(fanficData.NumberOfChapters),   
                Comments:           Number(fanficData.Comments),   
                Kudos:              Number(fanficData.Kudos),   
                Bookmarks:          Number(fanficData.Bookmarks),   
                Hits:               Number(fanficData.Hits),
                URL:                null,
                AuthorURL:          null,
                Series:             fanficData.SeriesName!=='' ? fanficData.SeriesName : undefined,
                SeriesPart:         fanficData.SeriesNumber!=='' ? Number(fanficData.SeriesNumber) : undefined,
                SeriesURL:         fanficData.SeriesNumber!=='' ? '' : undefined
            }
            resolve(fanfic)
    });
   
}
