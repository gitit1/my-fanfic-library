const clc = require("cli-color");
const Validator = require("validator");
const isEmpty = require("is-empty");
const nodemailer = require('nodemailer');

exports.contactUs = (req,res) =>{
    console.log(clc.blue('[db controller] contactUs()'));
    const {name,email,message} = req.body;

    const { errors, isValid } = validateForm(req.body);
    // Check validation
      if (!isValid) {
        res.status(400).json(errors);
      }else{
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'myfanficslibrary@gmail.com',
              pass: '039625248alona'
            }
          });
          
          var mailOptions = {
            from: 'myfanficslibrary@gmail.com',
            to: 'myfanficslibrary@gmail.com',
            subject: 'My Fanfics Library - Message',
            text: `Name: ${name} \n Email: ${email} \n Message: ${message} \n`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.send('send')
      }

}


const validateForm = (data) =>{
        let errors = {};
        // Convert empty fields to an empty string so we can use validator functions
        data.name = !isEmpty(data.name) ? data.name : "";
        data.email = !isEmpty(data.email) ? data.email : "";
        // Name checks
        if (Validator.isEmpty(data.name)) {
            errors.name = "Name field is required";
        }
        // Email checks
        if (Validator.isEmpty(data.email)) {
            errors.email = "Email field is required";
        } else if (!Validator.isEmail(data.email)) {
            errors.email = "Email is invalid";
        }

        return {
            errors,
            isValid: isEmpty(errors)
        };
};
