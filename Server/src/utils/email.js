const nodemailer = require('nodemailer');

const mailType = {
    reset: 'reset',
    newPassword: 'newPassword',
    welcome: 'welcome',
};

const htmlResetPasswordMail = (name, token) => {
    return `
        <h1>Hello, ${name}</h1>
        <h3>Use this code to set your new Password, only valid for 5 mins</h3>
        <strong>${token}</strong>
        <br>
        <mark>Dont share this code to anyone, or they can take your account permantly!</mark>
    `;
};

const htmlnewPasswordMail = (name, newPassword) => {
    return `
        <h1>Hello, ${name}</h1>
        <h3>Your new password of your account is below:</h3>
        <mark><strong>${newPassword}</strong></mark>
        <br>
        <mark>Dont share this to anyone, or they can take your account permantly!</mark>
    `;
};
const htmlWelcomeMail = (name, password) => {
    return `
        <h1>Welcome Welcome, ${name}</h1>
        <h3>Your account has been created, below is your init password, please login as quick as and change password to yours</h3>
        <strong>${password}</strong>
        <br>
        <mark>Dont share this to anyone, or they can take your account permantly!</mark>
    `;
};

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

    async send(subject, type, message) {
        let htmlMail = '';
        switch (type) {
            case mailType.reset:
                htmlMail = htmlResetPasswordMail(this.firstName, message);
                break;
            case mailType.newPassword:
                htmlMail = htmlnewPasswordMail(this.firstName, message);
                break;
            case mailType.welcome:
                htmlMail = htmlWelcomeMail(this.firstName, message);
                break;
            default:
                throw new Error('Invalid type case');
        }
        const mailOption = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: htmlMail,
        };

        await this.newTransport().sendMail(mailOption);
    }

    async sendResetPasswordMail(token) {
        await this.send('Reset password', mailType.reset, token);
    }

    async sendNewPasswordMail(newPassword) {
        await this.send('New Password', mailType.newPassword, newPassword);
    }

    async sendWelcomeMail(password) {
        await this.send('Welcome!', mailType.welcome, password);
    }
};
