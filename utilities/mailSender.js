"use strict";
const nodemailer = require("nodemailer");
const secrets = require("../secrets");
// async..await is not allowed in global scope, must use a wrapper
async function mailSender(email,token) { // token is otp

    // input through which mechanism send your email -> port, facilitator(technical details)
    let transporter = nodemailer.createTransport({
        service : "gmail",
        host: "smtp.gmail.com",
        secure: true,
        auth: {
            user: secrets.APP_EMAIL, // generated ethereal user
            pass: secrets.APP_PASSWORD, // generated ethereal password
        },
    });
    // let name = "Sanket"; // token
    let dataObj = {
        from: '"Eat-Fit 👻" <foo@example.com>', // sender address
        // to: "2020UCP1984@mnit.ac.in, banaitsanket4@gmail.com", // list of receivers
        to: email,
        subject: "Reset Password", // Subject line
        text: "Reset Password", // plain text body
        html: `<b>Your reset otp is ${token}</b>`, // html body
    }

    // send mail with defined transport object(dataObj)
    let info = await transporter.sendMail(dataObj);

}

// mailSender(email,token).then(function(){
//     console.log("mail sent successfully");
// }).catch(console.error);

module.exports = mailSender;
