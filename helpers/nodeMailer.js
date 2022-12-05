var nodemailer = require('nodemailer')


var mailConfig = {
    service: 'gmail',
    auth: {
        user:'arbeiter2k22@gmail.com',
        pass:'bzzjiwrrrugwtwno'
    }
}

var transporter=nodemailer.createTransport(mailConfig);

module.exports =transporter;