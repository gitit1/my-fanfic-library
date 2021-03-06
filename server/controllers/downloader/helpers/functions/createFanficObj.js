exports.createFanficObj = async (fandomName, fanficData) => {
    let todayDate = new Date();

    return await new Promise(async function (resolve, reject) {
        fanfic = {
            FandomName: fandomName,
            FanficID: Number(fanficData.FanficID),
            FanficTitle: fanficData.FanficTitle,
            Author: fanficData.Author,
            AuthorURL: fanficData.AuthorURL !== '' ? fanficData.AuthorURL : undefined,
            Author1: fanficData.Author1 ? fanficData.Author1 : undefined,
            AuthorURL1: fanficData.AuthorURL1 !== '' ? fanficData.AuthorURL1 : undefined,
            Source: fanficData.Source,
            NumberOfChapters: Number(fanficData.NumberOfChapters),
            Complete: fanficData.Complete === 'true' ? true : false,
            Oneshot: fanficData.Oneshot === 'true' ? true : false,
            URL: fanficData.URL !== '' ? fanficData.URL : undefined,
            Rating: fanficData.Rating,
            PublishDate: Number(fanficData.PublishDate),
            LastUpdateOfFic: Number(fanficData.LastUpdateOfFic),
            LastUpdateOfNote: todayDate.getTime(),
            Tags: [
                fanficData.Warnings && fanficData.Warnings !== '' ? { warnings: fanficData.Warnings.split(',') } : undefined,
                fanficData.Relationships && fanficData.Relationships !== '' ? { relationships: fanficData.Relationships.split(',') } : undefined,
                fanficData.Characters && fanficData.Characters !== '' ? { characters: fanficData.Characters.split(',') } : undefined,
                fanficData.Tags && fanficData.Tags !== '' ? { tags: fanficData.Tags.split(',') } : undefined
            ].filter(x => x !== undefined),
            FandomsTags: fanficData.FandomsTags && fanficData.FandomsTags !== '' ? fanficData.FandomsTags.split(',') : undefined,
            Categories: !fanficData.Categories ? undefined : fanficData.Categories !== '' ? fanficData.Categories.split(',') : undefined,
            Description: fanficData.Description,
            Language: fanficData.Language,
            Words: Number(fanficData.Words),
            Comments: Number(fanficData.Comments),
            Kudos: Number(fanficData.Kudos),
            Bookmarks: Number(fanficData.Bookmarks),
            Hits: Number(fanficData.Hits),
            Series: fanficData.Series && fanficData.Series !== '' ? fanficData.Series : undefined,
            SeriesPart: fanficData.Series && fanficData.SeriesPart !== '' ? Number(fanficData.SeriesPart) : undefined,
            SeriesURL: fanficData.Series && fanficData.SeriesURL ? fanficData.SeriesURL : undefined,
            Deleted: fanficData.Deleted && (typeof fanficData.Deleted === 'boolean') ? fanficData.Deleted :
                (fanficData.Deleted === 'true') ? true : false
        }
        resolve(fanfic)
    });

}
