export const buildFormData = (fandomName,fanficForm) =>{
        const Rating = (fanficForm['Rating'].value==='') ? 'None' : fanficForm['Rating'].value;
        const PublishDate = fanficForm['PublishDate'].value.getTime();
        const UpdateDate = fanficForm['UpdateDate'].value.getTime();
        const Language = (fanficForm['Language'].value==='') ? 'English' : fanficForm['Language'].value;
        const Oneshot = (!fanficForm['Oneshot'].value==='') ? fanficForm['Oneshot'].value : (fanficForm['Complete'].value) ? true : false;
        const Comments = (fanficForm['Comments'].value==='') ? 100 : fanficForm['Comments'].value;
        const Kudos = (fanficForm['Kudos'].value==='') ? 100 : fanficForm['Kudos'].value;
        const Bookmarks = (fanficForm['Bookmarks'].value==='') ? 100 : fanficForm['Bookmarks'].value;
        const Hits = (fanficForm['Hits'].value==='') ? 100 : fanficForm['Hits'].value;

        let fanficFormData = new FormData();
        fanficFormData.append("FandomName", fandomName);
        fanficFormData.append("Rating", Rating);
        fanficFormData.append("FanficID", fanficForm['FanficID'].value);
        fanficFormData.append("FanficTitle", fanficForm['FanficTitle'].value);
        fanficFormData.append("Author", fanficForm['Author'].value);
        fanficFormData.append("FandomsTags", fanficForm['FandomsTags'].value);
        fanficFormData.append("Warnings", fanficForm['Warnings'].value);
        fanficFormData.append("Relationships", fanficForm['Relationships'].value);
        fanficFormData.append("Characters", fanficForm['Characters'].value);
        fanficFormData.append("Tags", fanficForm['Tags'].value);
        fanficFormData.append("Categories", fanficForm['Categories'].value);
        fanficFormData.append("SeriesName", fanficForm['SeriesName'].value);
        fanficFormData.append("SeriesNumber", fanficForm['SeriesNumber'].value);
        fanficFormData.append("Summary", fanficForm['Summary'].value);
        fanficFormData.append("Source", fanficForm['Source'].value);
        fanficFormData.append("PublishDate", PublishDate);
        fanficFormData.append("UpdateDate", UpdateDate);
        fanficFormData.append("Language", Language);
        fanficFormData.append("Words", fanficForm['Words'].value);
        fanficFormData.append("NumberOfChapters", fanficForm['NumberOfChapters'].value);
        fanficFormData.append("Complete", fanficForm['Complete'].value);
        fanficFormData.append("Oneshot", Oneshot);
        fanficFormData.append("Comments", Comments);
        fanficFormData.append("Kudos", Kudos);
        fanficFormData.append("Bookmarks", Bookmarks);
        fanficFormData.append("Hits", Hits);

        // console.log('fanficFormData:')
        // for (var pair of fanficFormData.entries()) {
        //     console.log(pair[0]+ ' : '+ pair[1]); 
        //  }
    return fanficFormData;
}
