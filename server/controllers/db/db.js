const axios = require('axios');
const cheerio = require('cheerio');
const clc = require("cli-color");

exports.addFandomToDB = (req,res) =>{   
    console.log(clc.blue('[db] addFandomToDB'));

    //TODO: get fandoms name list from user and fandom data    
    fandomsNames = ["Cazzie","Avalance"];
    
    let date = new Date().getTime()
    
    const fandom = {
            "Save_Method": ["PDF","EPUB"],
            "Fanfics_in_Fandom": 0,
            "Fandom_Name": "Cazzie",
            "On_Going_Fanfics": 0,
            "Last_Update": date,
            "Complete_fanfics": 0,
            "Saved_fanfics": 0,
            "Search_Keys": "Casey Gardner/Izzie",
            "Auto_Save": true
        }
    // {
    //     "Save_Method": ["PDF","EPUB"],
    //     "Fanfics_in_Fandom": 0,
    //     "Fandom_Name": "Avalance",
    //     "On_Going_Fanfics": 0,
    //     "Last_Update": date,
    //    "Complete_fanfics": 0,
    //     "Saved_fanfics": 0,
    //     "Search_Keys": "Sara Lance/Ava Sharpe",
    //     "Auto_Save": false
    // }

    if(fandomsNames.includes(fandom.Fandom_Name)){
        res.send('Fandom already exist!!');
        console.log(clc.red('Fandom already exist!!'));
    }else{
        axios.post( 'https://my-fanfic-lybrare.firebaseio.com/fandoms.json', fandom )
        .then( response => {
            res.send('Fandom '+fandom.Fandom_Name+' ,added to db')
        } )
        .catch( error => {
            res.send('error in [db] addFandomToDB: '+error.response.data.error);
            console.log(clc.red(error.response.data.error));
        } );
    }

    //TODO: ADD FIXED IMAGE TO  FANFICS / ADDITIONAL IMAGE FOR ONESHOT IF THEY WANT 
    //console.log(date)
    //console.log(new Date(date).toLocaleString())
    
}

exports.getAllFandomsFromDB = (req,res) =>{
    console.log(clc.blue('[db] getAllFandomsFromDB'));
    axios.get( 'https://my-fanfic-lybrare.firebaseio.com/fandoms.json')
    .then( response => {
        res.send(response.data)
    } )
    .catch( error => {
        res.send('error in [db] addFandomToDB')
        console.log(clc.red(error));
    } );
}

//Connection between DB/AO3:
exports.getFanficsFromAo3 = (req,res) =>{
    console.log(clc.blue('[db] getFanficsFromAo3'));
     let fandomNameOriginal = "Avalance";
     //let fandomNameOriginal = "Avalance";
     //let fandomNameOriginal = "Cazzie";

    axios.get(`https://my-fanfic-lybrare.firebaseio.com/fandoms.json?orderBy="Fandom_Name"&equalTo="${fandomNameOriginal}"`)
    .then( async fandom => {
        fandomData = fandom.data[Object.keys(fandom.data)[0]];
        
        let fandomName = fandomData.Search_Keys.replace(/ /g,'%20').replace(/\//g,'*s*');
        
        let fanfics = await getFanficsOfFandom(fandomName,fandomData.Auto_Save,fandomData.Save_Method);
        await deleteDataOfFanficsFromServer(fandomNameOriginal)
        await sendFanficsToServer(fandomNameOriginal,fanfics)

        res.send(JSON.stringify(fanfics, null, 4));
        //TODO: send to server each note
        //TODO: UPDATE-FANFICS

        //res.send(fandom.data[Object.keys(fandom.data)[0]])
    } ).catch(error => {
        res.send(error.message)
    })
}

const deleteDataOfFanficsFromServer = (fandomName) => {
    axios.delete(`https://my-fanfic-lybrare.firebaseio.com/fanfics/${fandomName}.json`)
    .then(() =>{
        return true
    }).catch(error=>{
        console.log('couldent delete: ',error)
        return false
    })
}

const sendFanficsToServer =  async (fandomName,fanfics) => {
    console.log(clc.blue('[db] sendFanficsToServer'));
    axios.post( `https://my-fanfic-lybrare.firebaseio.com/fanfics/${fandomName}.json`,fanfics)
    .then( response => {
        return(response.data)
    } )
    .catch( error => {
        return('error in [db] addFandomToDB')
        console.log(clc.red(error));
    } );
}

const getFanficsOfFandom =  async (fandom,save,filetypes) => {
    console.log("I'm in getFanficsOfFandom");
    const ao3URL = 'https://archiveofourown.org'
    const url = `https://archiveofourown.org/tags/${fandom}/works`;

    let numberOfPages = 0;
    let works = [];
    let downloadList = [];

    const html = await axios.get(url).then(res => 
        res.data
    ).catch(err => 
        console.log(err)
    );

    let promises = [];
    const getPagesOfFandomData = async numberOfPages => {
        return new Promise(async(resolve, reject) => {
            //get user list from our db:
            let pages = [];
            [...Array(Number(numberOfPages-1))].forEach(async (num,index) => {

                // const page = await axios.get(`${ao3URL}/tags/${fandom}/works?page=${index}`).then(fanficsData => 
                //     fanficsData.data
                // ).catch(err => 
                //     console.log(err)
                // ); 

                //await pages.push(page)
                
                //let data = works.push(getDataFromAO3FandomPage(page))
                promises.push(axios.get(`${ao3URL}/tags/${fandom}/works?page=${index+1}`))
            });
            axios.all(promises).then(function(results) {
                results.forEach(function(response) {
                   pages.push(response.data)
                   //console.log(pages.length);
                })
                promises = [];
                resolve(pages)
            });
            
        });
    }

    if(html){
        let seriesArray = []
        let $ = cheerio.load(html);
        if(Number($('#main').find('ol.pagination li').eq(-2).text())>=10){
            numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text())+1;
        }else{
            numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text());
        }
        
        pagesArray = await getPagesOfFandomData(numberOfPages);

        await pagesArray.map(page => promises.push(getDataFromAO3FandomPage(page)))
    
        allFanficsList = await Promise.all(promises);

        await allFanficsList.forEach(fanficArray => {
            works  = [
                ...works,
                ...fanficArray
            ]
        });
    }

    return works;


}

const getDataFromAO3FandomPage =  async (page) => {
    console.log("I'm in getDataFromAO3FandomPage");

    let $ = cheerio.load(page);
    let fanficData = [];

    await $('ol.work').children('li').each(function () {
        let fanfic = {}
        fanfic["Last_Update_Of_Note"] = new Date().getTime();
        fanfic["Favorite"] = false;            
        fanfic["Status"] = "Need To Read";
        fanfic["Chapter_Status"] = "";
        fanfic["Saved_Fic"] = false;

        fanfic["Fanfic_Title"] = $(this).find('div.header h4 a').first().text();
        fanfic["URL"] = 'https://archiveofourown.org'+ $(this).find('div.header h4 a').first().attr('href');
        fanfic["Author"] = $(this).find('div.header h4 a').last().text();
        fanfic["Author_URL"] = 'https://archiveofourown.org'+ $(this).find('div.header h4 a').last().attr('href');
        fanfic["Last_Update"] = new Date($(this).find('p.datetime').text()).getTime();
        fanfic["Rating"] = $(this).find('span.rating span').text();
        let tags = [];
        let warnings = [];
        let relationships = [];
        let characters = [];
        let freeforms = [];
        $(this).find('ul.tags').children('li').each(function () {
            if($(this).attr('class')=='warnings'){
                warnings.push($(this).text())
            }else if($(this).attr('class')=='relationships'){
                relationships.push($(this).first().text())
            }else if($(this).attr('class')=='characters'){
                characters.push($(this).first().text())
            }else if($(this).attr('class')=='freeforms'){
                freeforms.push($(this).first().text())
            }               
        });
        tags.push({'warnings':warnings},{'relationships':relationships},{'characters':characters},{'freeforms':freeforms})                       
        fanfic["Tags"] = tags;
        fanfic["Description"] = $(this).find('blockquote.summary').text();
        fanfic["Hits"] = $(this).find('dd.hits').text();
        fanfic["Kudos"] = $(this).find('dd.kudos').text(); 
        fanfic["Language"] = $(this).find('dd.language').text();  
        fanfic["Comments"] = $(this).find('dd.comments').text(); 
        fanfic["Words"] =  $(this).find('dd.words').text(); 
        fanfic["Number_of_Chapters"] =  $(this).find('dd.chapters').text().split('/')[0];  
        
        fanfic["Complete"] = ($(this).find('dd.chapters').text().split('/')[1] === '?') ? false : true

        fanficData.push(fanfic);
    });
    return fanficData
}
