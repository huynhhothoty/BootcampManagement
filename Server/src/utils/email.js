const nodemailer = require('nodemailer')

const sendEmail = async options => {
    // create transport
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 25,
        auth: {
            user: '4eceb01bd72893',
            pass: '0d17f6c814a6a2'
        }
        // activate Gmail less secure app option
    })

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
}

module.exports = sendEmail