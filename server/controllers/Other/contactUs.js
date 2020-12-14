const clc = require("cli-color");
const Validator = require("validator");
const keys = require("../../config/keys");
const isEmpty = require("is-empty");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(keys.sendgridApiKey);

exports.contactUs = (req,res) =>{
    console.log(clc.blue('[db controller] contactUs()'));
    const {name,email,message} = req.body;

    const { errors, isValid } = validateForm(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }else{
      const msg = {
        to: keys.emailMail,
        from: keys.emailMail,
        subject: 'My Fanfics Library - Message',
        text: `Name: ${name} , Email: ${email} , Message: ${message} `,
        html: `Name: ${name} \n Email: ${email} \n Message: ${message} \n`,
      };
      sgMail
        .send(msg)
        .then(() => {}, error => {
          console.error(error);
        
          if (error.response) {
            console.error(error.response.body)
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
