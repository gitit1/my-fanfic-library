
const clc = require("cli-color");
const cheerio = require('cheerio');
let request = require('request')

const ao3UserKeys = require("../../../../config/keys");

let jar = request.jar();
request = request.defaults({
  jar: jar,
  followAllRedirects: true
});

exports.loginToAO3 = () =>{
    console.log(clc.bgGreenBright('[ao3 controller] loginToAO3()'));
    let url = "https://archiveofourown.org/users/login/",utf8='',authenticity_token='',isLogin = false;
    return new Promise(async function(resolve, reject) {
        request.get({
            url: url,
            jar: jar,
            credentials: 'include'
        }, async function (err, httpResponse, body) {
            err && reject(err)
            let $ = cheerio.load(body);
            authenticity_token  = await $('#new_user').find("input[name = 'authenticity_token']").attr('value')
            utf8                = await $('#new_user').find("input[name = 'utf8']").attr('value')
            let details = {
                'utf8': utf8,
                'authenticity_token': authenticity_token,
                'user[login]': ao3UserKeys.ao3User,
                'user[password]':ao3UserKeys.ao3Password,
                'user[remember_me]':0,
                'commit':'Log in'
            };
            const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
            isLogin = await ($('#greeting').length > 0) ? true : false;
            !isLogin?(
                request({
                    url,
                    method: 'POST',
                    body: formBody,
                    headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    jar: jar,
                    credentials: 'include',
                }, async function (err, httpResponse, body) { 
                    err && reject(err)
                    let $ = cheerio.load(body);
                    isLogin = await ($('#greeting').length > 0) ? true : false
                    isLogin ? console.log(clc.green('logged in successfully to ao3')) : console.log(clc.red('Error in Loggging in'))
                    resolve()
                })   
            ):resolve(console.log(clc.green('you are already logged in to ao3'))) 
        })
    });
}