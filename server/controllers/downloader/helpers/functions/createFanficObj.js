exports.createFanficObj = async (fandomName,fanficData,isInFileReader) =>{
    let todayDate = new Date();
    return await new Promise(async function(resolve, reject) {
            fanfic = {
                FandomName:         fandomName,
                FanficID:           Number(fanficData.FanficID),
                FanficTitle:        fanficData.FanficTitle,
                Author:             fanficData.Author,
                AuthorURL:          fanficData.AuthorURL!=='' ? fanficData.AuthorURL : null,
                Source:             fanficData.Source,
                NumberOfChapters:   Number(fanficData.NumberOfChapters),
                Complete:           fanficData.Complete==='true' ? true : false,
                Oneshot:            fanficData.Oneshot==='true' ? true : false,
                URL:                isInFileReader ? fanficData.URL : fanficData.FanficURL!=='' ? fanficData.FanficURL : null,
                Rating:             fanficData.Rating,
                PublishDate:        Number(fanficData.PublishDate),
                LastUpdateOfFic:    isInFileReader ? Number(fanficData.LastUpdateOfFic) : Number(fanficData.UpdateDate),
                LastUpdateOfNote:   todayDate.getTime(),
                Tags:               isInFileReader ? fanficData.Tags : [
                                        fanficData.Warnings!=='' ? {warnings:fanficData.Warnings.split(',')} : undefined,
                                        fanficData.Relationships!=='' ? {relationships:fanficData.Relationships.split(',')} : undefined,
                                        fanficData.Characters!=='' ? {characters:fanficData.Characters.split(',')} : undefined,
                                        fanficData.Tags!=='' ? {tags:fanficData.Tags.split(',')} : undefined
                                    ].filter(x => x !== undefined),
                FandomsTags:        isInFileReader ? fanficData.FandomsTags : fanficData.FandomsTags!=='' ? fanficData.FandomsTags.split(',') : null,
                Categories:         isInFileReader ? null : fanficData.Categories!=='' ? fanficData.Categories.split(',') : null,
                Description:        isInFileReader ? fanficData.Description : fanficData.Summary,
                Language:           fanficData.Language,
                Words:              Number(fanficData.Words),   
                NumberOfChapters:   Number(fanficData.NumberOfChapters),   
                Comments:           Number(fanficData.Comments),   
                Kudos:              Number(fanficData.Kudos),   
                Bookmarks:          Number(fanficData.Bookmarks),   
                Hits:               Number(fanficData.Hits),
                Series:             isInFileReader ? null : fanficData.Series!=='' ? fanficData.SeriesName : undefined,
                SeriesPart:         isInFileReader ? null : fanficData.SeriesPart!=='' ? Number(fanficData.SeriesNumber) : undefined,
                SeriesURL:          isInFileReader ? null : fanficData.SeriesURL!=='' ? '' : undefined
            }
            resolve(fanfic)
    });
   
}
