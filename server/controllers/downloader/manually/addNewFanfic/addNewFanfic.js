const {checkForSimilar} = require('../../helpers/checkForSimilar')

exports.addNewFanfic = async (fandomName,fanficData) =>{
    const fanfic = {
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
                                {warnings:fanficData.Warnings.split(',')},
                                {relationships:fanficData.Relationships.split(',')},
                                {characters:fanficData.Characters.split(',')},
                                {tags:fanficData.Tags.split(',')}
                            ],
        FandomsTag:         fanficData.FandomsTags.split(','),
        Description:        fanficData.Summary,
        Language:           fanficData.Language,
        Words:              Number(fanficData.Words),   
        NumberOfChapters:   Number(fanficData.NumberOfChapters),   
        Comments:           Number(fanficData.Comments),   
        Kudos:              Number(fanficData.Kudos),   
        Bookmarks:          Number(fanficData.Bookmarks),   
        Hits:               Number(fanficData.Hits),   

    };   
    const checkForSimilarResult     =   await checkForSimilar(fanfic,fandomName)

    if(!checkForSimilarResult){
        return([fanfic]) 
    }else{
        return([fanfic,checkForSimilarResult[0]])
    }
}
