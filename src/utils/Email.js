const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
require('dotenv').config();

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Opemipo Jokotagba A. <${process.env.EMAIL_FROM}>`
    };

    /** Email Handler Transport */
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            /* Sendgrid Email Handler In Production */
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            }) // return value
        }
        /** MailTrap Email Configuration For Development Purposes */
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        });
    };

    async send(template, subject) {
        /** Render HTML for email based on a PUG template */
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        /** Define Email Options */
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.htmlToText(html)
        };

        /** Create Transport */
        await this.newTransport().sendMail(mailOptions);

    };

    /**Send Onboarding Email */
    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Twitee Family');
    };

};