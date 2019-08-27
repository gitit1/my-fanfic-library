
const clc = require("cli-color");

exports.getDataFromPage = (page,fandomName) =>{
    return new Promise(async function(resolve, reject) { 
        let fanfic = {};
        let todayDate = new Date();

        fanfic["LastUpdateOfNote"]      =       todayDate.getTime();

        fanfic["FandomName"]            =       fandomName;
        fanfic["Source"]                =       'AO3';
        fanfic["FanficID"]              =       Number(page.attr('id').replace('work_',''));
        console.log('getDataFromPage - fanfic["FanficID"]:',fanfic["FanficID"])
    
        fanficUpdateDate                =       page.find('p.datetime').text();
        fanfic["LastUpdateOfFic"]       =       fanficUpdateDate ==="" ? 0 : new Date(fanficUpdateDate).getTime();
        if(fanficUpdateDate ===""){
            console.log(clc.red('ERROR IN FANFIC DATE:',fanfic["FanficID"]))
            reject('error in fanficUpdateDate');
        }
    
        fanfic["NumberOfChapters"]      =       Number(page.find('dd.chapters').text().split('/')[0]);  
    
        chapCurrent = page.find('dd.chapters').text().split('/')[0]
        chapEnd = page.find('dd.chapters').text().split('/')[1]
        fanfic["Complete"] = (String(chapEnd) !== '?' && (Number(chapCurrent)===Number(chapEnd)) ) ? true : false
        fanfic["Oneshot"]  = (fanfic["Complete"] && fanfic["NumberOfChapters"]===1) ? true : false 
    
        fanfic["FanficTitle"]           =       page.find('div.header h4.heading a').first().text();
        fanfic["URL"]                   =       'https://archiveofourown.org'+ page.find('div.header h4 a').first().attr('href');
        fanfic["Author"]                =       page.find('div.header h4.heading a[rel=author]').text();
        fanfic["Author"]                =       (fanfic["Author"]===fanfic["FanficTitle"]||fanfic["Author"]=="") ? 'Anonymous' : fanfic["Author"]
    
        fanfic["AuthorURL"]             =       'https://archiveofourown.org'+ page.find('div.header h4 a').last().attr('href');
    
        
        rating = page.find('span.rating span').text();
        switch(rating){
            case 'General Audiences':       {rating = 'general'; break}                             
            case 'Teen And Up Audiences':   {rating = 'teen'; break}    
            case 'Mature':                  {rating = 'mature'; break}    
            case 'Explicit':                {rating = 'explicit'; break}    
            case 'Not Rated':               {rating = 'none'; break}  
            default:                        rating = 'none';
        }
        fanfic["Rating"]                =       rating;
    
        let tags =[],warnings =[],relationships =[],characters =[],freeforms =[],fandomsTags=[];
        page.find('ul.tags').children('li').each(index => {
            let tag = page.find('ul.tags').children('li').eq(index);
            switch(tag.attr('class')){
                case 'warnings':        {warnings.push(tag.text()); break}                             
                case 'relationships':   {relationships.push(tag.first().text()); break}    
                case 'characters':      {characters.push(tag.first().text()); break}    
                case 'freeforms':       {freeforms.push(tag.first().text()); break}            
            }               
        });
        if(warnings[0]=='No Archive Warnings Apply'||warnings[0]=='Creator Chose Not To Use Archive Warnings'){
            tags.push({'relationships':relationships},{'characters':characters},{'tags':freeforms});
        }else{
            tags.push({'warnings':warnings},{'relationships':relationships},{'characters':characters},{'tags':freeforms});
        }   
        fanfic["Tags"]                  =       tags;
    
        page.find('div.header h5').children('a').each(index => {
            let tag = page.find('div.header h5').children('a').eq(index);
            fandomsTags.push(tag.text())
        });
        fanfic["FandomsTags"]           =       fandomsTags;
        
        fanfic["Description"]           =       page.find('blockquote.summary').html();
        fanfic["Hits"]                  =       page.find('dd.hits').text() ===""  ? 0 : Number(page.find('dd.hits').text());
        fanfic["Kudos"]                 =       page.find('dd.kudos').text() ==="" ? 0 : Number(page.find('dd.kudos').text()); 
        fanfic["Language"]              =       page.find('dd.language').text()  
        fanfic["Comments"]              =       (page.find('dd.comments').text()) ==="" ? 0 : Number(page.find('dd.comments').text()); 
        fanfic["Bookmarks"]             =       (page.find('dd.bookmarks').text()) ==="" ? 0 : Number(page.find('dd.bookmarks').text());
        fanfic["Words"]                 =       Number(page.find('dd.words').text().replace(/,/g,'')); 
     
        fanfic["NeedToSaveFlag"]        =       false;

        resolve(fanfic);
    });
}