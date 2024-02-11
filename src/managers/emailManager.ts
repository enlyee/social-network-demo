import {emailAdapter} from "../adapters/emailAdapter";

export const emailManager = {
    async emailConfirmation(mailReceiver: string, code: string) {
        const subject = "Email Confirmation"
        const html =
            " <h1>Thank for your registration</h1>\n" +
            " <p>To finish registration please follow the link below:\n" +
            "     <a href='https://somesite.com/confirm-email?code="+code+"'>complete registration</a>\n" +
            " </p>\n"
        await emailAdapter.sendMail(mailReceiver, subject, html)
    },
    async passwordRecovery(mailReceiver: string, code: string) {
        const subject = "Password Recovery"
        const html =  "<h1>Password recovery</h1>"+
        "<p>To finish password recovery please follow the link below:"+ "" +
            "<a href='https://somesite.com/password-recovery?recoveryCode="+code+"'>recovery password</a>"+
        "</p>"
        await emailAdapter.sendMail(mailReceiver, subject, html)
    }
}