var nodemailer = require("nodemailer");
var config = require("../config/mailer");
var apiKey = "261db90f729fd93c141d50ca94b220e8-41a2adb4-ff412618";
var domain ="sandbox2e9370a8bc8940b2abe6bdee099e348d.mailgun.org";
var mailgun = require("mailgun-js")({apiKey: apiKey , domain: domain});
/*var smtpTransport = require("nodemailer-smtp-transport");*/

var transport = nodemailer.createTransport({
	service: "Mailgun",
	auth:{
		user: config.MAILGUN_USER,
		pass: config.MAILGUN_PASS
	}, 
	tls: {
		rejectUnauthorized: false
	}
});


module.exports = {
	sendEmail(from, to, subject, output) {
		return new Promise((resolve, reject) => {
			transport.sendMail({from, subject, to, output }, (err, info)=> {
				if(err) reject(err);

				resolve(info);
			});
		});
	}
}