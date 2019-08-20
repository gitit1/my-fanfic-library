const clc = require("cli-color");
const cheerio = require('cheerio');
const fs = require('fs');

const mongoose = require('../../../../config/mongoose');
const FandomModal = require('../../../../models/Fandom');

let request = require('request')
let jar = request.jar();

request = request.defaults({
  jar: jar,
  followAllRedirects: true
});

const fanficsPath = "public/fandoms";
const {getUrlBodyFromAo3} = require('./getUrlBodyFromAo3')

exports.saveFanficsToServer = async (fandom,method) =>{
    console.log('saveFanficsToServer:')
    let promises =[],slowMode;

    const {FandomName,SaveMethod,SavedFanficsLastUpdate} = fandom; let fanficsList=[];
    let saveType = (SaveMethod==='') ? method+',' : SaveMethod;

    // await this.loginToAO3()
    let fanficsCount = await mongoose.dbFanfics.collection(FandomName).countDocuments({});
    if (fanficsCount==0){
        let getData = await this.getFanficsOfFandom(fandom,method)
        return getData
    }else{
        fanficsList = await getFanficsToSave(FandomName);
        if(fanficsList.length===0){
            return [0,0]
        }
        // console.log('fanficsList:',fanficsList)
        //TODO: CHECK/ADD WHICH TYPE  IS SAVED IF NOT AUTO DOWNLOAD 
        slowMode = SavedFanficsLastUpdate===undefined ? true : false;
        if(fanficsList.length>0){
            await fanficsList.map(async (url) => promises.push(saveFanficToServerHandler(url,FandomName,saveType,slowMode)))
            return await Promise.all(promises).then(fanfics => {
                fanfics.map(async fanficInfo=>{
                    await mongoose.dbFanfics.collection(FandomName).updateOne({'FanficID': Number(fanficInfo[0])},{$set: {fileName:fanficInfo[1],SavedFic:true,NeedToSaveFlag:false}},(err, result) => {if (err) {throw err}})
                })
                FandomModal.updateOne({ 'FandomName': FandomName },{ $set: {'SavedFanficsLastUpdate':new Date().getTime()}},(err, result) => {if (err) {throw err} else {console.log('all saved!')}})        
                
            })
        }   
    }
}
exports.saveFanficToServerHandler = async (url,fandomName,saveMethod,savedNotAuto) =>{
    // console.log('saveFanficToServerHandler:',url,fandomName,saveMethod,savedNotAuto)
    // return await new Promise(async function(resolve, reject) { 
    //     resolve(saveFanficToServer(url,fandomName,saveMethod,savedNotAuto))
    //  })
    return saveFanficToServer(url,fandomName,saveMethod,savedNotAuto)
}

const saveFanficToServer = async (url,fandomName,saveMethod,savedNotAuto)=>{
    // console.log('saveFanficToServer:',url,fandomName,saveMethod,savedNotAuto)
    try {
        let links = [],methods=[];
        let fanficId = 0
        let filename = '';
        url = url + '?view_adult=true';
        saveMethods = (saveMethod!== ''||saveMethod||null||saveMethod.length>0) ? saveMethod : savedNotAuto;
        (!saveMethods.includes(",")) ? methods.push(saveMethods) : methods = saveMethods.split(',');
        return await new Promise(async function(resolve, reject) {
            let urlBody = await getUrlBodyFromAo3(url);

            let $ = cheerio.load(urlBody);

            await Promise.all(
                await methods.map(async (method) => {
                    let link = await $(`.download ul li a:contains("${method.toUpperCase()}")`).attr('href');
                    //\/downloads\/(.*)\/(.*)(\..*)\?.*
                    // let fanficName = await link.replace(/\/downloads\/(.*)\/(.*)\?.*/g, "$2").replace(/%20/g,' ');
                    let fanficName = await $('div#workskin h2').first().text().trim().replace(/[^\w ]/g, '');
                    //let authorName = await $('div#workskin h3').text().replace(/\s+/g," ");
                    let authorName = await ($('div#workskin h3').first().text().replace(/\s+/g," "))==='Anonymous' ? 'Anonymous' :  $('div#workskin h3 a').first().text().replace(/\s+/g," ");
                    authorName = (authorName==='') ? 'Anonymous' : authorName;
                    fanficId = await link.replace(/\/downloads\/(.*)\/.*/, "$1");
                    let fanficNewName= `${authorName}_${fanficName} (${fanficId}).${method}` 
                    filename = `${authorName}_${fanficName} (${fanficId})`
                    await links.push([`https://archiveofourown.org${link}`,fanficNewName])                 
                })
            ).then(()=>{
                Promise.all(links.map(x => downloader(x[0], `${fanficsPath}/${fandomName.toLowerCase()}/fanfics/${x[1]}`))).then(res => {
                    let counter = res.reduce((a, b) => a + b, 0);
                    if(counter===0){
                        resolve([fanficId,filename,saveMethods])
                    }else{
                        resolve([-1,null,null])
                    }
                })
            }).catch(error=>{reject(console.log(clc.red('Error in saveFanficToServerHandler(): URL: '+url+'filename: '+filename)))})
        })
    } catch (error) {
        console.log('there is an error in: saveFanficToServerHandler()',error)
    }
}

const getFanficsToSave = async (fandomName) =>{
    console.log(clc.bgGreenBright('[ao3 controller] getFanficsToSave()'));  
    console.log('fandomName',fandomName);  
    return new Promise(async function(resolve, reject) {
        filtered = []
        await mongoose.dbFanfics.collection(fandomName).find({$or: [{SavedFic:false},{NeedToSaveFlag:true}]}).toArray(async function(err, fanficsList) {
            if (err) { 
                return reject(red.clc('error in getFanficsToSave(): ',err))
            }
            filtered = []
            fanficsList.map(fanfic => {filtered.push(fanfic.URL)})
            // console.log('filtered:',filtered)
            resolve(filtered)
        });
    });
}

const downloader = (url, filename) => {
    return new Promise((resolve, reject) => {
        // console.log('url:',url)
        console.log('filename:',filename)
        const file = fs.createWriteStream(filename);
        request({url,jar, credentials: 'include'}).pipe(file);

        file.on('finish',() => {
            resolve(0)
        }).on('close',() => {
            fs.readFileSync(filename, 'utf8');    
        }).on('error',() => 
            reject(console.log(`There was an error in: downloader(): ${url} , filename: ${filename}`)
        )).on('timeout', function(e) {
            console.log(`TimeOut - redownloading: ${url}`)
            downloader(url, fileName);
        });  
    })
};