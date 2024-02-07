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
    }
}