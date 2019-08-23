const clc = require("cli-color");
let request = require('request')

exports.getPagesOfFandomData = async (jar,url,numberOfPages) => {
    let pages = [], promises = [];
    request = request.defaults({jar: jar,followAllRedirects: true});
    await [...Array(Number(numberOfPages))].forEach(async (num,index) => {promises.push(
        new Promise(async(resolve, reject) => {
            request.get({url: `${url}?page=${index+1}`,jar: jar, credentials: 'include'}, async function (err, httpResponse, body) {
                err && reject(console.log(clc.red('error in getPagesOfFandomData(): ',err)))
                pages.push(body)
                resolve()
            })
        })
    )});

    const reflect = p => p.then(v => ({v, status: "fulfilled" }),
    e => ({e, status: "rejected" }));

    await Promise.all(promises.map(reflect))
    promises = [];
    return pages

}
