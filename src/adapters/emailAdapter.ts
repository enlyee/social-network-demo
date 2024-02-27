"use strict";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASS,
    },
});

class EmailAdapter {
    async sendMail(mailReceiver: string, subject: string, html: string) {
        const info = await transporter.sendMail({
            from: `"BloggerPlatform" <${process.env.EMAIL_LOGIN}>`,
            to: mailReceiver,
            subject: subject,
            html: html
        })
}}

export const emailAdapter = new EmailAdapter()