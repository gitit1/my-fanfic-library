const axios = require('axios');
const cheerio = require('cheerio');
const clc = require("cli-color");
const multer = require('multer');
const path = require('path')
const fs = require('fs-extra');
const FandomModal = require('../../models/Fandom');
// const Fanfic = require('../../models/Fanfic');
const FanficsModal = require('../../models/Fanfics');
let ChosenFandomFanfics =[]
//----------------------------------------------------------Working and implemented with cliend:


exports.getAllFandomsFromDB = (req,res) =>{
    console.log(clc.blue('[db] getAllFandomsFromDB'));
    getDataFromDB().then(fetchedFandoms=>{
        !fetchedFandoms ? res.send('error in [db] getAllFandomsFromDB') : res.send(fetchedFandoms)
    })
}

const getDataFromDB = async () =>{
    // console.log(clc.blue('[db] getDataFromDB'));
    // return axios.get( 'https://my-fanfic-lybrare.firebaseio.com/fandoms.json')
    // .then( response => {
    //     const fetchedFandoms= []
    //         for(let key in response.data){
    //             fetchedFandoms.push({...response.data[key],id: key});
    //         }
    //     return fetchedFandoms
    // } )
    // .catch( error => {
        
    //     console.log(clc.red(error));
    //     return false
    // } );  
    let fetchedFandoms = await FandomModal.find({}, function(err, fandoms) {
            if (err){throw err;}
    }); 
    return fetchedFandoms
}


exports.addEditFandomToDB =  async (req,res) =>{
    console.log(clc.blue('[db] addEditFandomToDB'));

    let resultMessage = '';
    const {FandomName,mode,Image} = req.query

    let pathForImage = 'public/images/fandoms/';

    let image = JSON.parse(Image);
    let imageName = FandomName.replace("%26","&");

    if (!fs.existsSync(pathForImage+FandomName.replace("%26","&")) && image){
        fs.mkdirSync(pathForImage+FandomName,{recursive: true});
    }
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, pathForImage+imageName)
        },
        filename: function (req, file, cb) {
        cb(null,  FandomName + path.extname(file.originalname))
        // cb(null, Date.now() + '-' +file.originalname )
        }
    })
    let upload = multer({ storage: storage }).single('file');
    
    await upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            //return res.status(500).json(err)
            console.log('Muller Error',res.status(500).json(err));
            resultMessage = 'Error';
            return res.send(resultMessage);
        } else if (err) {  
            console.log('Other Error',err);
            //return res.status(500).json(err)
            resultMessage = 'Other Error';
            return res.send(resultMessage);
        }
        //check if I have an updated image/prev image/no image
        if(mode === 'add'){
            imageName = image ? (FandomName.replace("%26","&") + path.extname(req.file.originalname)) : '';
        }else{
            imageName = image ? (FandomName.replace("%26","&") + path.extname(req.file.originalname)) : req.body.Image_Name
            if(image){
                let path = pathForImage+'/'+req.body.Image_Name;
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                });
            }
        }
        const fandom = {    
            "id":                       req.body.id,
            "FandomName":               req.body.FandomName,
            "SearchKeys":               req.body.SearchKeys,
            "AutoSave":                 req.body.AutoSave,
            "SaveMethod":               req.body.SaveMethod,
            "FanficsInFandom":          req.body.FanficsInFandom,
            "OnGoingFanfics":           req.body.OnGoingFanfics,
            "CompleteFanfics":          req.body.CompleteFanfics,
            "SavedFanfics":             req.body.SavedFanfics,
            "LastUpdate":               Date.now(),
            "Image_Name":               imageName,
            "Image_Path":               req.body.FandomName
        }
        //TODO:add already exsist:
        try {
            const fandomData = new FandomModal(fandom);
            const fanficData = new FanficsModal({'FandomName':fandom.FandomName,'Fanfics':[]});
            if(req.query.mode === 'add'){
                console.log('add1')
                await fandomData.save();
                await fanficData.save();
                console.log('Fandom '+fandom.FandomName+' ,was updated in the db')
                resultMessage = 'Success';
                return res.send(resultMessage)
            }else{
                console.log('edit1')
                FandomModal.updateOne(
                    { 'FandomName': fandom.FandomName },
                    { $set: fandom},
                    (err, result) => {
                        if (err) throw err;
                        resultMessage = 'Success';
                        console.log('Fandom updated!');
                     }
                 )
            }
    
        } catch (error) {
            console.log(`Controller: DEMO - newUser - Error: \n${error.message}`)
            resultMessage = 'Error';
            return res.send(resultMessage);
        }     
        console.log('resultMessage:',resultMessage)
        return resultMessage
    
    })
  
}

exports.deleteFandomFromDB = async (req,res)=>{
    console.log(clc.blue('[db] deleteFandomFromDB'));
    
    try {
        await FandomModal.findOneAndDelete(
            { FandomName: req.query.FandomName.replace("%26","&") },() => console.log('deleted!')
        );
        res.send('Success')
     }
     catch(e){
        res.send('Error')
     }


}

//----------------------------------------------------------Testing:


exports.manageDownloader = async (socket,fandom) =>{
    console.log(clc.blue('[db] manageDownloader'));
    try {
        // console.log('fandomData:',fandom);

        if(fandom=='All'){
            console.log('---1---')
            let fetchedFandoms = await getDataFromDB().then(fetchedFandoms=>{
                if(!fetchedFandoms){
                    return false
                }else{
                    return fetchedFandoms
                }
            })
            let promises = [];
            if(fetchedFandoms){
                let p = Promise.resolve();

                await fetchedFandoms.map(fandom => promises.push(  
                    p = p.then(() => manageFandomFanficsHandler(socket,fandom) )                               
                ))
    
                return null;

            }else{
                console.log(clc.cyanBright(`Server got error in manageDownloader`));
                socket && socket.emit('getFanficsData', `<span style="color:red"><b>Server got error in manageDownloader</b></span>`);   
                return null;             
            }


        }else{
            console.log('---2---')
            await manageFandomFanficsHandler(socket,fandom)
        }



        // console.log(clc.cyanBright(`End`));
        // socket && socket.emit('getFanficsData', 'End');
        return null
    } catch(e) {
        console.log(e);
    }
}

const manageFandomFanficsHandler = async (socket,fandom) => {
        const {FandomName,SearchKeys} = fandom

        console.log(clc.cyanBright(`Server got fandom: ${FandomName}`));
        socket && socket.emit('getFanficsData', `<b>Server got fandom:</b> ${FandomName}`);
    
        console.log(clc.cyanBright(`Server got keys: ${SearchKeys}`));
        socket && socket.emit('getFanficsData', `<b>Server got keys:</b> ${SearchKeys}`);
        
    
        let fandomUrlName = SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
        socket && socket.emit('getFanficsData', `<b>Fixing keys to match url search:</b> ${fandomUrlName}`);
    
        console.log(clc.cyanBright(`Executing: getFanficsOfFandom()`));
        socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">getFanficsOfFandom()</span>`);

        const fanfics = await getFanficsOfFandom(socket,fandom);
        // const fanfics = await getFanficsOfFandom(socket,fandom,isNewFandom,oldData);

        console.log(clc.cyanBright(`Got ${fanfics.length} from getFanficsOfFandom`)),
        socket && socket.emit('getFanficsData', `Got ${fanfics.length} from <span style="color:brown">getFanficsOfFandom()</span>`)
        
        console.log(clc.cyanBright(`Executing: sendFanficsToServer()`));
        socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">sendFanficsToServer()</span>`);
        //await sendFanficsToServer(socket,fandom,fanfics);
}
const getAllFanficsFromServer = (FandomName) => {
    console.log(clc.blue('[db] getAllFanficsFromServer'));
    console.log('FandomName:',FandomName)
    return axios.get( `https://my-fanfic-lybrare.firebaseio.com/fanfics/${FandomName}.json`)
    .then( response => {
        return(response.data)
    } )
    .catch( error => {
        console.log(clc.red(error));
        return('error in [db] getAllFanficsFromServer')
    } );    
}



const deleteOldDataOfFanficsFromServer = (socket,FandomName) => {
    axios.delete(`https://my-fanfic-lybrare.firebaseio.com/fanfics/${FandomName}.json`)
    .then(() =>{
        return true
    }).catch(error=>{
        // console.log('couldent delete: ',error)
        return false
    })
}

const sendFanficsToServer =  async (socket,fandom,fanfics) => {
    console.log(clc.blue('[db] sendFanficsToServer'));

    const fanficData = new Fanfic(fanfics);
    await fanficData.save();
    console.log(`Fanfics of ${fandom.FandomName} was saved to server`)
}

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const getFanficsOfFandom =  async (socket,fandom) => {

        console.log(clc.blue('[db] getFanficsOfFandom'));

        const {id,FandomName,SearchKeys,AutoSave,SaveMethod} = fandom;

        //console.log('isNewFandom:',isNewFandom)

        let fandomUrlName = SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
        //console.log(clc.cyanBright(`Executing: getFanficsOfFandom()`));
        //socket && socket.emit('getFanficsData', `<b>Server In Function:</b> <span style="color:brown">getFanficsOfFandom()</span>`);


        const ao3URL = `https://archiveofourown.org/tags/${fandomUrlName}/works`;
        console.log('ao3URL:',ao3URL)
        let numberOfPages = 0;
        let works = [];
        let downloadList = [];

        const html = await axios.get(ao3URL).then(res => 
            res.data
        ).catch(err => 
            console.log(err)
        );

        let promises = [];

        const getPagesOfFandomData = async numberOfPages => {
            return new Promise(async(resolve, reject) => {
                //get user list from our db:
                let pages = [];
                [...Array(Number(numberOfPages))].forEach(async (num,index) => {

                    // const page = await axios.get(`${ao3URL}/tags/${fandom}/works?page=${index}`).then(fanficsData => 
                    //     fanficsData.data
                    // ).catch(err => 
                    //     console.log(err)
                    // ); 

                    //await pages.push(page)
                    
                    //let data = works.push(getDataFromAO3FandomPage(page))
                    promises.push(axios.get(`${ao3URL}?page=${index+1}`))
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
            
            if(Number($('#main').find('ol.pagination li').eq(-2).text())===0){
                numberOfPages = 1
            }else if(Number($('#main').find('ol.pagination li').eq(-2).text())>=10){
                numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text())+1;
            }else{
                numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text());
            }

            console.log('numberOfPages: ',numberOfPages)
            pagesArray = await getPagesOfFandomData(numberOfPages);

            await FanficsModal.findOne({FandomName: FandomName},async function(err, fandom) {
                ChosenFandomFanfics = await (fandom.Fanfics===[]) ? [] : fandom.Fanfics
            });

            await pagesArray.map(page => promises.push(   
                delay(3000).then(() => getDataFromAO3FandomPage(socket,page,FandomName))             
            ))

        
            allFanficsList = await Promise.all(promises);
            //await Promise.all(promises);

            await allFanficsList.forEach(fanficArray => {
                works  = [
                    ...works,
                    ...fanficArray
                ]
            });
        }
        console.log('works length:'+works.length);
        let FanficsInFandom = works.length
        let CompleteFanfics = await works.filter(function(fanfic){return fanfic.Complete==true}).length
        let OnGoingFanfics = works.length - CompleteFanfics


        await FanficsModal.updateOne(
            { 'FandomName': FandomName },
            { $set:     {'LastUpdate':new Date().getTime(),
                         'Pages':numberOfPages}},
            (err, result) => {
                if (err) throw err;
                console.log('Fanfics updateded');
             }
         )
         await FandomModal.updateOne(
            { 'FandomName': FandomName },
            { $set:     {'FanficsInFandom':FanficsInFandom,
                         'CompleteFanfics':CompleteFanfics,
                         'OnGoingFanfics':OnGoingFanfics}},
            (err, result) => {
                if (err) throw err;
                console.log('Fandom updateded');
             }
         )


        return works;


}

const getDataFromAO3FandomPage =  async (socket,page,FandomName) => {
        console.log(clc.blue('[db] getDataFromAO3FandomPage'));
        // socket && socket.emit('getFanficsData', `<b>Server In Function:</b> <span style="color:brown">getDataFromAO3FandomPage()</span>`);

        let $ = cheerio.load(page);
        let fanficData = [];
        let FanficUpdated = false;

        await $('ol.work').children('li').each(async function () {
            let fanfic = {}
            
            //socket && socket.emit('getFanficsData', `<b>Getting data of:</b> <span style="color:purple">${$(this).find('div.header h4 a').first().text()}</span>`);
            fanfic["FanficID"]         = Number($(this).attr('id').replace('work_',''));
            let oldFanficData = (ChosenFandomFanfics.length===0) ? false :  ChosenFandomFanfics.filter(oldFanfic => oldFanfic.FanficID===fanfic["FanficID"])[0]

            fanfic["LastUpdateOfNote"]      =    new Date().getTime();
            fanfic["Favorite"]              =    oldFanficData ? oldFanficData.Favorite : false;         
            fanfic["Status"]                =    oldFanficData ? oldFanficData.Status : "Need To Read";
            fanfic["ChapterStatus"]         =    oldFanficData ? oldFanficData.ChapterStatus : 0;
            fanfic["SavedFic"]              =    oldFanficData ? oldFanficData.SavedFic : false;
            
            fanfic["FanficTitle"] = $(this).find('div.header h4 a').first().text();
            fanfic["URL"] = 'https://archiveofourown.org'+ $(this).find('div.header h4 a').first().attr('href');
            fanfic["Author"] = $(this).find('div.header h4 a').last().text();
            fanfic["AuthorURL"] = 'https://archiveofourown.org'+ $(this).find('div.header h4 a').last().attr('href');
            fanfic["LastUpdateOfFic"] = $(this).find('p.datetime').text() ==="" ? 0 : new Date($(this).find('p.datetime').text()).getTime();
            // console.log('fanfic.LastUpdateOfFic',fanfic["LastUpdateOfFic"])
            // console.log('oldFanficData.LastUpdateOfFic',oldFanficData.LastUpdateOfFic)
            if(oldFanficData && fanfic["LastUpdateOfFic"]>oldFanficData.LastUpdateOfFic){
                console.log('fanfic got updated!!!!!!!!!!!!!')
            }
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
            fanfic["Tags"]              =  tags;
            fanfic["Description"]       =  $(this).find('blockquote.summary').text();
            fanfic["Hits"]              =  $(this).find('dd.hits').text()       ===""  ? 0 : Number($(this).find('dd.hits').text());
            fanfic["Kudos"]             =  $(this).find('dd.kudos').text()      ==="" ? 0 : Number($(this).find('dd.kudos').text()); 
            fanfic["Language"]          =  $(this).find('dd.language').text()  
            fanfic["Comments"]          =  ($(this).find('dd.comments').text()) ==="" ? 0 : Number($(this).find('dd.comments').text()); 
            fanfic["Words"]             =  $(this).find('dd.words').text(); 
            fanfic["NumberOfChapters"]  =  Number($(this).find('dd.chapters').text().split('/')[0]);  
            
            chapCurrent = $(this).find('dd.chapters').text().split('/')[0]
            chapEnd = $(this).find('dd.chapters').text().split('/')[1]
            fanfic["Complete"] = (String(chapEnd) !== '?' && (Number(chapCurrent)===Number(chapEnd)) ) ? true : false

            fanfic["Image"]             = "";
            

            fanficData.push(fanfic);
            
            //const fanficRecord = new Fanfics({'FandomName':FandomName,'Fanfics':fanfics});
            await FanficsModal.findOne({FandomName: FandomName}, async function(err, fandom) {
                if (err) { console.log('err: ',err)}
                    let isExist = (oldFanficData!==undefined) ? true : false;
                    console.log('isExist: ',isExist)
                    if(!isExist){
                        fandom.Fanfics.push({
                            FanficID:               fanfic["FanficID"],
                            LastUpdateOfNote:       fanfic["LastUpdateOfNote"],
                            LastUpdateOfFic:        fanfic["LastUpdateOfFic"],
                            Favorite:               fanfic["Favorite"],
                            Status:                 fanfic["Status"],
                            ChapterStatus:          fanfic["ChapterStatus"],
                            SavedFic:               fanfic["SavedFic"],
                            FanficTitle:            fanfic["FanficTitle"],
                            URL:                    fanfic["URL"],
                            Author:                 fanfic["Author"],
                            AuthorURL:              fanfic["AuthorURL"],    
                            NumberOfChapters:       fanfic["NumberOfChapters"],    
                            Complete:               fanfic["Complete"],    
                            Rating:                 fanfic["Rating"],    
                            Tags:                   fanfic["Tags"], 
                            Language:               fanfic["Language"],    
                            Hits:                   fanfic["Kudos"],     
                            Kudos:                  fanfic["Kudos"],     
                            Comments:               fanfic["Comments"],     
                            Words:                  fanfic["Words"],     
                            Description:            fanfic["Description"],     
                            Image:                  fanfic["Image"], 
                        });
                        await fandom.save();
                    }else{                   
                        await FanficsModal.updateOne(
                            { 'FandomName': FandomName, 'Fanfics.FanficID':fanfic["FanficID"]},
                            { $set:{'Fanfics.$':{
                                FanficID:               fanfic["FanficID"],
                                LastUpdateOfNote:       fanfic["LastUpdateOfNote"],
                                LastUpdateOfFic:        fanfic["LastUpdateOfFic"],
                                Favorite:               fanfic["Favorite"],
                                Status:                 fanfic["Status"],
                                ChapterStatus:          fanfic["ChapterStatus"],
                                SavedFic:               fanfic["SavedFic"],
                                FanficTitle:            fanfic["FanficTitle"],
                                URL:                    fanfic["URL"],
                                Author:                 fanfic["Author"],
                                AuthorURL:              fanfic["AuthorURL"],    
                                NumberOfChapters:       fanfic["NumberOfChapters"],    
                                Complete:               fanfic["Complete"],    
                                Rating:                 fanfic["Rating"],    
                                Tags:                   fanfic["Tags"], 
                                Language:               fanfic["Language"],    
                                Hits:                   fanfic["Kudos"],     
                                Kudos:                  fanfic["Kudos"],     
                                Comments:               fanfic["Comments"],     
                                Words:                  fanfic["Words"],     
                                Description:            fanfic["Description"],     
                                Image:                  fanfic["Image"]
                            }}},
                            (err, result) => {
                                if (err) throw err;
                                console.log('Fanfics updateded');
                        })
                }
    
            });
            //const fanfics = new Fanfics(fanfic);
            //await fanficRecord.save();

        })


    return fanficData
}
//*************************************************************** */
exports.getFanficsFromDB = (req,res) =>{
    const {FandomName,startPage,endPage} = req.query;
    console.log('FandomName: ',FandomName)
    let skip = Number(startPage-1);
    let limit = Number(endPage);

    //  Fanfics.findOne({FandomName: FandomName}).sort({'Fanfics.LastUpdateOfFic': -1 }).skip(startPage-1).limit(endPage).lean().exec(async function(err, fandom) {
        //,sort:{'Fanfics.LastUpdateOfFic': 'descending }
    //  FanficsModal.findOne({FandomName: FandomName},{Fanfics:{$slice:[skip,limit]}},{sort:{'Fanfics.LastUpdateOfFic': 'asc'}},function(err, fandom) {
    //  FanficsModal.findOne({FandomName: FandomName},{Fanfics:{$slice:[skip,limit]}},{sort:{'Fanfics.LastUpdateOfFic':'asc'}},function(err, fandom) {
        // if (err) { console.log('err: ',err)}
        // sortParam = 'LastUpdateOfFic';
        // //sortParam = 'FanficTitle';
        FanficsModal.findOne({FandomName: FandomName},function(err, fandom) {
            let sortParam = 'LastUpdateOfFic';
            const sortedFanficsList =fandom.Fanfics.sort(function(a, b) { 
                return a[sortParam] - b[sortParam];
            })
            // res.send(sortedFanficsList.slice(skip, limit))
            res.send(sortedFanficsList.reverse().slice(skip, limit))
        });
        // // fanficsLimitedList = fandom.Fanfics.slice(startPage-1, endPage);
        // //fanficsLimitedList = fandom.Fanfics
        // //const sortedFanficsList = fanficsLimitedList.sort((a, b) => a[sortParam].localeCompare(b[sortParam]))
        // // const sortedFanficsList =fandom.Fanfics.sort(function(a, b) { 
        //     //     return a[sortParam] - b[sortParam];
        //     //     }).reverse()
        //     // res.send(sortedFanficsList.slice(startPage-1, endPage))
        //     console.log('sss')
        //     // fandom.Fanfics.map(res=>console.log(res.FanficTitle))
        //     res.send(fandom.Fanfics)
        //     });
            
            // FanficsModal.aggregate([
            //    { "$match": {FandomName: FandomName}},
            //    {$slice:["$Fanfics",skip,limit]}, 
            //    {$unwind: "$Fanfics"}, 
            //    {$sort: {"Fanfics.LastUpdateOfFic":1}}, 
            //  ]).exec(function(err, fandom) {
            //    console.log(fandom)
            //  })
    // Fanfics.findOne({FandomName: FandomName}, async function(err, fandom) {
    //     if (err) { console.log('err: ',err)}
    //     sortParam = 'LastUpdateOfFic';
    //     //sortParam = 'FanficTitle';

    //     // fanficsLimitedList = fandom.Fanfics.slice(startPage-1, endPage);
    //     //fanficsLimitedList = fandom.Fanfics
    //     //const sortedFanficsList = fanficsLimitedList.sort((a, b) => a[sortParam].localeCompare(b[sortParam]))
    //     const sortedFanficsList =fandom.Fanfics.sort(function(a, b) { 
    //         return a[sortParam] - b[sortParam];
    //         }).reverse()
    //     res.send(sortedFanficsList.slice(startPage-1, endPage))
    // });
}
/* --------------------------------------------------------- OLD*/
//Connection between DB/AO3:
exports.getFanficsFromAo3 = (req,res) =>{
    console.log(clc.blue('[db] getFanficsFromAo3'));
     let FandomNameOriginal = "Avalance";
     //let FandomNameOriginal = "Avalance";
     //let FandomNameOriginal = "Cazzie";

    axios.get(`https://my-fanfic-lybrare.firebaseio.com/fandoms.json?orderBy="FandomName"&equalTo="${FandomNameOriginal}"`)
    .then( async fandom => {
        fandomData = fandom.data[Object.keys(fandom.data)[0]];
        
        let FandomName = fandomData.SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
        
        let fanfics = await getFanficsOfFandom(FandomName,fandomData.AutoSave,fandomData.SaveMethod);
        await deleteDataOfFanficsFromServer(FandomNameOriginal)
        await sendFanficsToServer(FandomNameOriginal,fanfics)

        res.send(JSON.stringify(fanfics, null, 4));
        //TODO: send to server each note
        //TODO: UPDATE-FANFICS

        //res.send(fandom.data[Object.keys(fandom.data)[0]])
    } ).catch(error => {
        res.send(error.message)
    })
}

exports.addFandomToDB = (req,res) =>{   
    console.log(clc.blue('[db] addFandomToDB'));
    //TODO: check errors for image: size/not uplode/not image...
    

    //res.send('Error')

    let pathForImage = `../client/src/assets/images/fandoms/${req.query.FandomName}`;   
    let ImageName = `../client/src/assets/images/fandoms/${req.query.FandomName}`;

    console.log('image: ',req.query.Image)
    console.log('!fs.existsSync(pathForImage): ',!fs.existsSync(pathForImage))
    console.log('req.query.Image: ',req.query.Image)

    if (!fs.existsSync(pathForImage) && req.query.Image){
        console.log('!fs.existsSync(pathForImage) 2: ',!fs.existsSync(pathForImage))
        console.log('req.query.Image 2: ',req.query.Image)
        fs.mkdirSync(pathForImage);
    }

    console.log('req.file:',req.file)
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, pathForImage)
        },
        filename: function (req, file, cb) {
        cb(null, req.query.FandomName + path.extname(file.originalname))
        // cb(null, Date.now() + '-' +file.originalname )
        }
    })
    let upload = multer({ storage: storage }).single('file');

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            //return res.status(500).json(err)
            console.log('Muller Error',res.status(500).json(err));
            return res.send('Error');
        } else if (err) {  
            console.log('Other Error',err);
            //return res.status(500).json(err)
            return res.send('Error');
        }

 

        let image = null;
        if(req.query.mode === 'add'){
            image = req.file === undefined||req.file === null ? '' : (req.query.FandomName + path.extname(req.file.originalname));
        }else{
            image = req.file === undefined||req.file === null ? req.body.Image_Name : (req.query.FandomName + path.extname(req.file.originalname));
        }
       console.log('image:',image)

        const fandom = {    
            "id":                       Date.now(),
            "FandomName":               req.body.FandomName,
            "SearchKeys":               req.body.SearchKeys,
            "AutoSave":                 req.body.AutoSave,
            "SaveMethod":               req.body.SaveMethod,
            "FanficsInFandom":          req.body.FanficsInFandom,
            "OnGoingFanfics":           req.body.OnGoingFanfics,
            "CompleteFanfics":          req.body.CompleteFanfics,
            "SavedFanfics":             req.body.SavedFanfics,
            "LastUpdate":               req.body.LastUpdate,
            "Image_Name":               image
        }
        console.log(req.body.fandomsNames)

        if(req.query.mode === 'add'){
            var fandomArray = req.body.fandomsNames.split(",");
            if(req.body.fandomsNames.length>0 && fandomArray.includes(fandom.FandomName)){
                console.log(clc.red('Fandom Already Exist'));
                return res.send('Fandom Already Exist');
            }
            console.log('axios add')
            axios.post( 'https://my-fanfic-lybrare.firebaseio.com/fandoms.json', fandom )
            .then( () => {
                console.log('Fandom '+fandom.FandomName+' ,added to db')
                return 'Fandom '+fandom.FandomName+' ,added to db'
            } )
            .catch( error => {
                console.log('error 1')
                console.log(clc.red(error));
                // return res.send('Error');
            } );
        }else{
            console.log('axios edit')
            axios.patch(`https://my-fanfic-lybrare.firebaseio.com/fandoms/${req.body.FandomID}.json`, fandom )
            .then( () => {
                console.log('Fandom '+fandom.FandomName+' ,was updated in the db')
                return 'Fandom '+fandom.FandomName+' ,was updated in the db'
            } )
            .catch( error => {
                console.log('error 2')
                console.log(clc.red(error));
                // return res.send('Error');
            } );
        }

        
        
        // return res.status(200).send(req.file)
        // return res.status(200).send(req.file)
        console.log('Success')
        return res.send('Success');

    })

    //TODO: ADD FIXED IMAGE TO  FANFICS / ADDITIONAL IMAGE FOR ONESHOT IF THEY WANT 
    //console.log(date)
    //console.log(new Date(date).toLocaleString())
    
}
