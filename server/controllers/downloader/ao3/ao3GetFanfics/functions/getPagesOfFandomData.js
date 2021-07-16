const clc = require("cli-color");

const {getUrlBodyFromAo3} = require('../../helpers/getUrlBodyFromAo3')
const pLimit = require('p-limit');
const limit = pLimit(1);

exports.getPagesOfFandomData = async (jar,url,numberOfPages, fromPage) => {
    let pages = [], promises = [];

    [...Array(Number(numberOfPages))].forEach(async (num,index) => {promises.push(limit(async () =>{
        let pageIndex = index + 1;
        if(fromPage){
            pageIndex = fromPage + index;
        }
        let body = await getUrlBodyFromAo3(jar,`${url}?page=${pageIndex}`)
        if(!body){
            console.log(clc.red('error in getPagesOfFandomData(): ',err))
        }else{
            pages.push(body)
        }
    }))});

    const reflect = p => p.then(v => ({v, status: "fulfilled" }),
    e => ({e, status: "rejected" }));

    await Promise.all(promises.map(reflect))
    promises = [];
    return pages

}
