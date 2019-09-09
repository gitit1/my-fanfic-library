const clc = require("cli-color");

exports.contactUs = (req,res) =>{
    console.log(clc.blue('[db controller] contactUs()'));
    const {name,email,message} = req.body;
    console.log('name,email,message',name,email,message);

    res.send('send')
}