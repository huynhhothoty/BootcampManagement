const nodemailer = require('nodemailer');

module.exports = class Email {
    constructor(user) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.from = 'LMS Admin <huynhhothoty15@gmail.com>';
    }

    newTransport() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'huynhhothoty15@gmail.com',
                pass: 'tahs whde bmzl gpqh',
            },
        });

        // return nodemailer.createTransport({
        //     host: 'sandbox.smtp.mailtrap.io',
        //     port: 25,
        //     auth: {
        //         user: '4eceb01bd72893',
        //         pass: '0d17f6c814a6a2',
        //     },
        // });
    }

    async send(subject, message) {
        const htmlResetPasswordMail = `
            <h1>Hello, ${this.firstName}</h1>
            <h3>Use this code to set your new Password, only valid for 5 mins</h3>
            <strong>${message}</strong>
            <br>
            <mark>Dont share this code to anyone, or they can take your account permantly!</mark>
        `;

        const mailOption = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: htmlResetPasswordMail,
        };

        await this.newTransport().sendMail(mailOption);
    }

    async sendResetPasswordMail(token) {
        await this.send('Reset password', token);
    }
};
