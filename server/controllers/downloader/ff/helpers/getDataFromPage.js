const cheerio = require('cheerio');

const {getUrlBodyFromSite} = require('./getUrlBodyFromSite')

exports.getDataFromPage = async (url,fandomName) =>{
    return new Promise(async function(resolve, reject) {

        let fanfic = {},tags=[],freeforms =[],characters=[],relationships=[];
        let isChaptersAttr = false,isGnere = false,ischaractersTags = false,isLanguage=false;
    
        let body = await getUrlBodyFromSite(url);
        let $ = cheerio.load(body);
        
        $('#profile_top span.xgray').text().split(' - ').forEach(attr => {
            if(attr.includes('Rated:')){
                fanfic.Rating =  getRating($('#profile_top span.xgray a[target=rating]').text());
            }else if(attr.includes('Chapters:')){
                fanfic.NumberOfChapters = Number(attr.split(': ')[1].replace(' ',''));
                isChaptersAttr = true;
                fanfic.Oneshot = false;
            }else if(!isChaptersAttr && !isGnere && !ischaractersTags && !isLanguage){
                fanfic.Language = attr;
                isLanguage = true;
            }else if(isLanguage && !isChaptersAttr && !isGnere && !ischaractersTags){
                attr.split('/').forEach(tag => {
                    freeforms.push(tag)
                });
                freeforms.length>0 && tags.push({'tags':freeforms});
                isGnere = true;
            }else if(isLanguage && !isChaptersAttr && isGnere && !ischaractersTags){
                if(attr.includes(']')){
                    attr.split('] ').forEach(tag => {
                        if(tag.includes('[')||tag.includes(']')){
                            relationships.push(tag.replace('[','').replace(']','').replace(',','/'))
                        }else{
                            tag.split(',').forEach(subtag => {
                                characters.push(subtag)
                            });
                        }
                    });
                }else{
                    attr.split(',').forEach(tag => {
                        characters.push(tag)
                    });
                }
                characters.length>0 && tags.push({'characters':characters});            
                relationships.length>0 && tags.push({'relationships':relationships});            
                ischaractersTags = true;
            }else if(attr.includes('Words:')){
                fanfic.Words = Number(attr.split(': ')[1].replace(',',''));
            }else if(attr.includes('Reviews:')){
                fanfic.Comments = Number(attr.split(': ')[1].replace(' ','').replace(',',''));
            }else if(attr.includes('Favs:')){
                fanfic.Kudos = Number(attr.split(': ')[1].replace(' ','').replace(',',''));
            }else if(attr.includes('Follows:')){
                fanfic.Bookmarks = Number(attr.split(': ')[1].replace(' ','').replace(',',''));
            }else if(attr.includes('id:')){
                fanfic.FanficID = Number(attr.split(': ')[1].replace(' ',''));
            }else if(attr.includes('Complete')){
                fanfic.Complete = true;
            }
    
        });
        fanfic.Description = $('#profile_top div.xcontrast_txt').html()
        if(!fanfic.Complete){
            fanfic.Complete = false;
        }
        if(!fanfic.NumberOfChapters && fanfic.Complete){
            fanfic.NumberOfChapters = 1
            fanfic.Oneshot = true
        }
    
        fanfic.URL                  =       url
        fanfic.Source               =       'FF'
        fanfic.FandomName           =       fandomName;
        fanfic.FanficTitle          =       $('#profile_top b.xcontrast_txt').first().text();
        fanfic.Author               =       $('#profile_top a.xcontrast_txt').first().text();
        fanfic.AuthorURL            =       'https://www.fanfiction.net' + $('#profile_top a.xcontrast_txt').first().attr('href');
        fanfic.LastUpdateOfFic      =       Number($('#profile_top span.xgray span').first().attr('data-xutime')+'000');
        fanfic.PublishDate          =       (fanfic.Oneshot) ? fanfic.LastUpdateOfFic : Number($('#profile_top span.xgray span').last().attr('data-xutime')+'000');
        fanfic.LastUpdateOfNote     =       new Date().getTime();
        fanfic.Tags = tags;
    
        resolve(fanfic);
    });
}

const getRating = rating =>{
    switch (rating) {
        case 'Fiction  K+':
            return 'general';
            break;
        case 'Fiction  K':
            return 'general';
            break;  
        case 'Fiction  T':
            return 'teen';
            break;
        case 'Fiction  M':
            return 'mature';
            break;               
        default:
            return 'none';
            break;
    }
}