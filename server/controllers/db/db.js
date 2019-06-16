const axios = require('axios');
const cheerio = require('cheerio');
const clc = require("cli-color");
const multer = require('multer');
const path = require('path')
const fs = require('fs-extra');

//----------------------------------------------------------Working and implemented with cliend:
exports.getAllFandomsFromDB = (req,res) =>{
    console.log(clc.blue('[db] getAllFandomsFromDB'));
    getDataFromDB().then(fetchedFandoms=>{
        !fetchedFandoms ? res.send('error in [db] addFandomToDB') : res.send(fetchedFandoms)
    })
}

const getDataFromDB = async () =>{
    console.log(clc.blue('[db] getDataFromDB'));
    return axios.get( 'https://my-fanfic-lybrare.firebaseio.com/fandoms.json')
    .then( response => {
        const fetchedFandoms= []
            for(let key in response.data){
                fetchedFandoms.push({...response.data[key],id: key});
            }
        return fetchedFandoms
    } )
    .catch( error => {
        
        console.log(clc.red(error));
        return false
    } );   
}

exports.addEditFandomToDB =  async (req,res) =>{
    console.log(clc.blue('[db] addEditFandomToDB'));

    let resultMessage = '';
    const {FandomName,oldFandomName,mode} = req.query
    // let mode = req.query.mode;
    // let FandomName = req.query.FandomName
    // let oldFandomName = req.query.oldFandomName;
    let pathForImage = 'public/images/fandoms/';
    console.log('this.query: ',req.query)
    let image = JSON.parse(req.query.Image);
    //let imageName = (oldFandomName!==false && oldFandomName) ? FandomName : oldFandomName;
    let imageName = FandomName;

    if (!fs.existsSync(pathForImage+FandomName) && image){
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
            imageName = image ? (FandomName + path.extname(req.file.originalname)) : '';
        }else{
            imageName = image ? (FandomName + path.extname(req.file.originalname)) : req.body.Image_Name
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
            "FandomName":               req.body.FandomName,
            "SearchKeys":               req.body.SearchKeys,
            "AutoSave":                 req.body.AutoSave,
            "SaveMethod":               req.body.SaveMethod,
            "FanficsInFandom":          req.body.FanficsInFandom,
            "OnGoingFanfics":           req.body.OnGoingFanfics,
            "CompleteFanfics":          req.body.CompleteFanfics,
            "SavedFanfics":             req.body.SavedFanfics,
            "LastUpdate":               req.body.LastUpdate,
            "Image_Name":               imageName,
            "Image_Path":               req.body.FandomName
        }
        if(req.query.mode === 'add'){
            let fandomArray = req.body.fandomsNames.split(",");
            console.log('fandomArray: ',fandomArray)
            if(req.body.fandomsNames.length>0 && fandomArray.includes(fandom.FandomName)){
                console.log(clc.red('Fandom Already Exist'));
                resultMessage = 'Fandom Already Exist';
                return res.send(resultMessage);
            }else{
                await axios.post( 'https://my-fanfic-lybrare.firebaseio.com/fandoms.json', fandom )
                    .then( () => {
                        console.log('Fandom '+fandom.FandomName+' ,added to db');
                        resultMessage = 'Success';
                        return res.send(resultMessage)
                    } )
                    .catch( error => {
                        console.log(clc.red(error));
                        resultMessage = 'Error';
                        return res.send(resultMessage);
                    } );               
                }
        }else{
            await axios.patch(`https://my-fanfic-lybrare.firebaseio.com/fandoms/${req.body.FandomID}.json`, fandom )
            .then( () => {
                console.log('Fandom '+fandom.FandomName+' ,was updated in the db')
                resultMessage = 'Success';
                return res.send(resultMessage)
            } )
            .catch( error => {
                console.log(clc.red(error));
                resultMessage = 'Error';
                return res.send(resultMessage);
            } );
        }        
        console.log(resultMessage)
        return resultMessage
    
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

    upload(req, res, function (err) {
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
            console.log('fandomArray: ',fandomArray)
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

exports.deleteFandomFromDB = async (req,res)=>{
    console.log(clc.blue('[db] deleteFandomFromDB'));
    
    axios.delete(`https://my-fanfic-lybrare.firebaseio.com/fandoms/${req.query.id}.json`).then(() =>{
        let pathForImage = 'public/images/fandoms/';
        fs.remove(pathForImage+req.query.FandomName).then(() => {
            res.send('Success') 
        }).catch(err => {
        console.error(err)
        })       
    }).catch(error=>{
        console.error(error)
        res.send('Error')
    });

}

//----------------------------------------------------------Testing:


exports.manageDownloader = async (socket,fandom) =>{
    console.log(clc.blue('[db] manageDownloader'));
    try {
        console.log('fandomData:',fandom);

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
    
        let oldData=''
        console.log(clc.cyanBright(`Executing: getAllFanficsFromServer()`));
        socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">getAllFanficsFromServer()</span>`);
        await getAllFanficsFromServer(FandomName).then(res=>{
            oldData = res
        });
        const isNewFandom = (oldData===undefined || oldData===null) ? true : false;
        if(!isNewFandom){
            console.log(clc.cyanBright(`Executing: deleteOldDataOfFanficsFromServer()`));
            socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">deleteOldDataOfFanficsFromServer()</span>`);
            await deleteOldDataOfFanficsFromServer(socket,FandomName);
        }

        console.log('isNewFandom :::',isNewFandom)

        console.log(clc.cyanBright(`Executing: getFanficsOfFandom()`));
        socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">getFanficsOfFandom()</span>`);

        const fanfics = await getFanficsOfFandom(socket,fandom,isNewFandom,oldData);

        console.log(clc.cyanBright(`Got ${fanfics.length} from getFanficsOfFandom`)),
        socket && socket.emit('getFanficsData', `Got ${fanfics.length} from <span style="color:brown">getFanficsOfFandom()</span>`)
        
        console.log(clc.cyanBright(`Executing: sendFanficsToServer()`));
        socket && socket.emit('getFanficsData', `<b>Executing:</b> <span style="color:brown">sendFanficsToServer()</span>`);
        await sendFanficsToServer(socket,fandom,fanfics);
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


const getAllFanficsFromServer = (FandomName) => {
    console.log(clc.blue('[db] getAllFanficsFromServer'));
    console.log('FandomName:',FandomName)
    return axios.get( `https://my-fanfic-lybrare.firebaseio.com/fanfics/${FandomName}.json`)
    .then( response => {
        return(response.data)
    } )
    .catch( error => {
        console.log(clc.red(error));
        return('error in [db] addFandomToDB')
    } );    
}

const sendFanficsToServer =  async (socket,fandom,fanfics) => {
    console.log(clc.blue('[db] sendFanficsToServer'));
    axios.post( `https://my-fanfic-lybrare.firebaseio.com/fanfics/${fandom.FandomName}.json`,fanfics,{maxContentLength: 52428890})
    .then( async response => {
        await axios.patch(`https://my-fanfic-lybrare.firebaseio.com/fandoms/${fandom.id}/.json`, {'FanficsId':response.data.name} )
        // return(response.data)
        return(true)
    } )
    .catch( error => {
        console.log(clc.red(error));
        return('error in [db] addFandomToDB')
    } );
}

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const getFanficsOfFandom =  async (socket,fandom,isNewFandom,oldData) => {

        console.log(clc.blue('[db] getFanficsOfFandom'));

        const {id,FandomName,SearchKeys,AutoSave,SaveMethod} = fandom;

        console.log('isNewFandom:',isNewFandom)

        let fandomUrlName = SearchKeys.replace(/ /g,'%20').replace(/\//g,'*s*');
        console.log(clc.cyanBright(`Executing: getFanficsOfFandom()`));
        socket && socket.emit('getFanficsData', `<b>Server In Function:</b> <span style="color:brown">getFanficsOfFandom()</span>`);


        const ao3URL = `https://archiveofourown.org/tags/${fandomUrlName}/works`;

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

            if(Number($('#main').find('ol.pagination li').eq(-2).text())>=10){
                numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text())+1;
            }else{
                numberOfPages = Number($('#main').find('ol.pagination li').eq(-2).text());
            }


            pagesArray = await getPagesOfFandomData(numberOfPages);

            await pagesArray.map(page => promises.push(   
                delay(3000).then(() => getDataFromAO3FandomPage(socket,page))             
            ))

        
            allFanficsList = await Promise.all(promises);

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

        let resultMessage=null
        console.log('FandomID '+id)
        await axios.patch(`https://my-fanfic-lybrare.firebaseio.com/fandoms/${id}/.json`, {'FanficsInFandom':FanficsInFandom,
                                                                                           'CompleteFanfics':CompleteFanfics,
                                                                                           'OnGoingFanfics':OnGoingFanfics} )
        .then( () => {
            console.log('Fandom '+FandomName+' ,was updated in the db')
            resultMessage = 'Success';
        } )
        .catch( error => {
            console.log(clc.red(error));
            resultMessage = 'Error';
        } );
        console.log('resultMessage:',resultMessage)

        return works;


}

const getDataFromAO3FandomPage =  async (socket,page) => {
        console.log(clc.blue('[db] getDataFromAO3FandomPage'));
        // socket && socket.emit('getFanficsData', `<b>Server In Function:</b> <span style="color:brown">getDataFromAO3FandomPage()</span>`);

        let $ = cheerio.load(page);
        let fanficData = [];

        await $('ol.work').children('li').each(function () {
            let fanfic = {}
            
            //socket && socket.emit('getFanficsData', `<b>Getting data of:</b> <span style="color:purple">${$(this).find('div.header h4 a').first().text()}</span>`);
            
            fanfic["LastUpdateOfNote"] = new Date().getTime();
            fanfic["Favorite"] = false;            
            fanfic["Status"] = "Need To Read";
            fanfic["ChapterStatus"] = "";
            fanfic["SavedFic"] = false;
            
            fanfic["FanficTitle"] = $(this).find('div.header h4 a').first().text();
            fanfic["URL"] = 'https://archiveofourown.org'+ $(this).find('div.header h4 a').first().attr('href');
            fanfic["Author"] = $(this).find('div.header h4 a').last().text();
            fanfic["AuthorURL"] = 'https://archiveofourown.org'+ $(this).find('div.header h4 a').last().attr('href');
            fanfic["LastUpdate"] = new Date($(this).find('p.datetime').text()).getTime();
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
            fanfic["Hits"]              =  Number($(this).find('dd.hits').text());
            fanfic["Kudos"]             =  Number($(this).find('dd.kudos').text()); 
            fanfic["Language"]          =  $(this).find('dd.language').text()  
            fanfic["Comments"]          =  ($(this).find('dd.comments').text())==="" ? 0 : Number($(this).find('dd.comments').text()); 
            fanfic["Words"]             =  $(this).find('dd.words').text(); 
            fanfic["NumberOfChapters"]  =  Number($(this).find('dd.chapters').text().split('/')[0]);  
            
            chapCurrent = $(this).find('dd.chapters').text().split('/')[0]
            chapEnd = $(this).find('dd.chapters').text().split('/')[1]
            fanfic["Complete"] = (String(chapEnd) !== '?' && (Number(chapCurrent)===Number(chapEnd)) ) ? true : false

            fanfic["Image"]             = "";
            fanfic["ID"]                = Number($(this).attr('id').replace('work_',''));

            fanficData.push(fanfic);
        })


    return fanficData
}
//*************************************************************** */
exports.getFanficsFromDB = (req,res) =>{
    const {FandomName,FanficsId,startPage,endPage} = req.query;
    console.log('FanficsId: ',FanficsId)
    //orderBy="id" - could be name,date... according to filter
    return axios.get( `https://my-fanfic-lybrare.firebaseio.com/fanfics/${FandomName}/${FanficsId}.json?orderBy="LastUpdate"&startAt=${startPage}&endAt=${endPage}`)
    //
    .then( response => {
        console.log(response.data['FanficsId'])
        res.send(response.data[FanficsId])
    } )
    .catch( error => {
        console.log(clc.red(error));
        res.send('error in [db] getFanficsFromDB')
    } );     
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
