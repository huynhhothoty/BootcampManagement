const nodemailer = require('nodemailer')
const { google } = require('googleapis');


const CLIENT_ID = '451183807457-4397eb2ns23opm6a3rigk7hueasndc8m.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04c8mfPnneQgtCgYIARAAGAQSNwF-L9IrXfjyJtkDG94h-TkMUPqYiN7Tp2BnxnM9wuON78qgOZCD4CFqtSUvwoJuNT4bUENN_MQ';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async options => {
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
        const MyAccessToken = await oAuth2Client.getAccessToken()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'huynhhothoty15@gmail.com', // Địa chỉ email Gmail của bạn
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: MyAccessToken
            }
        });

        // define mail options
        const mailOption = {
            from: 'Bootcamp Admin',
            to: options.email,
            subject: options.subject,
            text: options.message,
            // html: 
        }

        // send mail
        await transporter.sendMail(mailOption)
    } catch (error) {
        return next(error)
    }
}

module.exports = sendEmail