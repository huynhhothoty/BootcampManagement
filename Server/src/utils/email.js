const nodemailer = require('nodemailer');
const CustomError = require('./CustomError');
const { google } = require('googleapis');
const fs = require('fs');

const CLIENT_ID =
    '451183807457-4397eb2ns23opm6a3rigk7hueasndc8m.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN =
    '1//04rIgNPtaiZAaCgYIARAAGAQSNwF-L9Ir5_nsdt4S6KWgFwkKeamsmDvQ4wTEDbMasWC8UZXCVUoipXGIlIItheCQ9ph9suyw3pg';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (options) => {
    // create transport -> mailtrap - in dev
    // const transporter = nodemailer.createTransport({
    //     host: 'sandbox.smtp.mailtrap.io',
    //     port: 25,
    //     auth: {
    //         user: '4eceb01bd72893',
    //         pass: '0d17f6c814a6a2'
    //     }
    // })

    // create transport -> gmail - prod
    try {
        const MyAccessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'huynhhothoty15@gmail.com', // Địa chỉ email Gmail của bạn
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: MyAccessToken,
            },
        });

        // const htmlContent = fs.readFileSync('emailContent.html', 'utf-8')
        const htmlContent = '';

        const mailOption = {
            from: 'Bootcamp Admin',
            to: options.email,
            subject: options.subject,
            // text: options.message,
            html: `
                <div style="width: 100%; height: 200px; background-color: aqua; padding: 20px; border-radius: 10px;">
                    <h2>Here's your reset code</h2>
                    <p style="font-weight: bold; color: red; font-style: italic; margin-bottom: 30px;">
                        !!!Note: Please don't share this code to anyone or they can take your account
                    </p>
                    <span style="border: 3px solid black; text-align: center; padding: 14px 17px;">
                        ${options.message}
                    </span>
                </div>
            `,
        };

        await transporter.sendMail(mailOption);
    } catch (error) {
        return new CustomError(error);
    }
};

module.exports = sendEmail;
