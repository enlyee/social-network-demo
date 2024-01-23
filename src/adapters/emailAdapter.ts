"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "backendtest228@gmail.com",
        pass: "awjm cghm cqss emeo",
    },
});

// async..await is not allowed in global scope, must use a wrapper
export const emailAdapter = {
    async sendMail(mailReciver: string, code: string) {
    // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"BloggerPlatformAuth" <backendtest228@gmail.com>', // sender address
            to: mailReciver, // list of receivers
            subject: "EmailConfirmation", // Subject line
            html: " <h1>Thank for your registration</h1>\n" +
                " <p>To finish registration please follow the link below:\n" +
                "     <a href='https://somesite.com/confirm-email?code="+code+" '>complete registration</a>\n" +
                " </p>\n"
        });

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
}}

