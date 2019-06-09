const axios = require('axios');
const cheerio = require('cheerio');
const clc = require("cli-color");
const multer = require('multer');
const path = require('path')
const fs = require('fs-extra');


exports.addEditFandomToDB =  async (req,res) =>{
    console.log(clc.blue('[db] addEditFandomToDB'));

    let resultMessage = '';
    let mode = req.query.mode;
    let pathForImage = `../client/src/assets/images/fandoms/${req.query.Fandom_Name}`;
    let image = JSON.parse(req.query.Image);
    let imageName = '';
    let imageNameTemp = req.query.Fandom_Name +'_'+new Date().getTime();

    if (!fs.existsSync(pathForImage) && image){
        console.log('!fs.existsSync(pathForImage) 2: ',!fs.existsSync(pathForImage))
        console.log('req.query.Image 2: ',req.query.Image)
        fs.mkdirSync(pathForImage);
    }
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, pathForImage)
        },
        filename: function (req, file, cb) {
        cb(null,  imageNameTemp + path.extname(file.originalname))
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
            imageName = image ? (imageNameTemp + path.extname(req.file.originalname)) : '';
        }else{
            imageName = image ? (imageNameTemp + path.extname(req.file.originalname)) : req.body.Image_Name
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
            "Fandom_Name":              req.body.Fandom_Name,
            "Search_Keys":              req.body.Search_Keys,
            "Auto_Save":                req.body.Auto_Save,
            "Save_Method":              req.body.Save_Method,
            "Fanfics_in_Fandom":        req.body.Fanfics_in_Fandom,
            "On_Going_Fanfics":         req.body.On_Going_Fanfics,
            "Complete_fanfics":         req.body.Complete_fanfics,
            "Saved_fanfics":            req.body.Saved_fanfics,
            "Last_Update":              req.body.Last_Update,
            "Image_Name":               imageName,
            "Image_Path":               req.body.Fandom_Name
        }
        if(req.query.mode === 'add'){
            let fandomArray = req.body.fandomsNames.split(",");
            console.log('fandomArray: ',fandomArray)
            if(req.body.fandomsNames.length>0 && fandomArray.includes(fandom.Fandom_Name)){
                console.log(clc.red('Fandom Already Exist'));
                resultMessage = 'Fandom Already Exist';
                return res.send(resultMessage);
            }else{
                await axios.post( 'https://my-fanfic-lybrare.firebaseio.com/fandoms.json', fandom )
                    .then( () => {
                        console.log('Fandom '+fandom.Fandom_Name+' ,added to db');
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
            await axios.patch(`https://my-fanfic-lybrare.firebaseio.com/fandoms/${req.body.Fandom_ID}.json`, fandom )
            .then( () => {
                console.log('Fandom '+fandom.Fandom_Name+' ,was updated in the db')
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

    let pathForImage = `../client/src/assets/images/fandoms/${req.query.Fandom_Name}`;   
    let ImageName = `../client/src/assets/images/fandoms/${req.query.Fandom_Name}`;

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
        cb(null, req.query.Fandom_Name + path.extname(file.originalname))
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
            image = req.file === undefined||req.file === null ? '' : (req.query.Fandom_Name + path.extname(req.file.originalname));
        }else{
            image = req.file === undefined||req.file === null ? req.body.Image_Name : (req.query.Fandom_Name + path.extname(req.file.originalname));
        }
       console.log('image:',image)

        const fandom = {    
            "Fandom_Name":              req.body.Fandom_Name,
            "Search_Keys":              req.body.Search_Keys,
            "Auto_Save":                req.body.Auto_Save,
            "Save_Method":              req.body.Save_Method,
            "Fanfics_in_Fandom":        req.body.Fanfics_in_Fandom,
            "On_Going_Fanfics":         req.body.On_Going_Fanfics,
            "Complete_fanfics":         req.body.Complete_fanfics,
            "Saved_fanfics":            req.body.Saved_fanfics,
            "Last_Update":              req.body.Last_Update,
            "Image_Name":               image
        }
        console.log(req.body.fandomsNames)

        if(req.query.mode === 'add'){
            var fandomArray = req.body.fandomsNames.split(",");
            console.log('fandomArray: ',fandomArray)
            if(req.body.fandomsNames.length>0 && fandomArray.includes(fandom.Fandom_Name)){
                console.log(clc.red('Fandom Already Exist'));
                return res.send('Fandom Already Exist');
            }
            console.log('axios add')
            axios.post( 'https://my-fanfic-lybrare.firebaseio.com/fandoms.json', fandom )
            .then( () => {
                console.log('Fandom '+fandom.Fandom_Name+' ,added to db')
                return 'Fandom '+fandom.Fandom_Name+' ,added to db'
            } )
            .catch( error => {
                console.log('error 1')
                console.log(clc.red(error));
                // return res.send('Error');
            } );
        }else{
            console.log('axios edit')
            axios.patch(`https://my-fanfic-lybrare.firebaseio.com/fandoms/${req.body.Fandom_ID}.json`, fandom )
            .then( () => {
                console.log('Fandom '+fandom.Fandom_Name+' ,was updated in the db')
                return 'Fandom '+fandom.Fandom_Name+' ,was updated in the db'
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
        var pathForImage = `../client/src/assets/images/fandoms/${req.query.Fandom_Name}`;
        fs.remove(pathForImage).then(() => {
            console.log(pathForImage);
            res.send('Success') 
        }).catch(err => {
        console.error(err)
        })       
    }).catch(error=>{
        console.error(error)
        res.send('Error')
    });

}


/* --------------------------------------------------------- */
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
