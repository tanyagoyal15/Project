var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
var session = require("express-session");
var bodyParser = require("body-parser");
var Joi = require("joi");
var mongoose = require("mongoose");
var User = require("./models/user");
var passport = require("passport");
var nodemailer = require("nodemailer");
var randomstring = require("randomstring");
var mailer = require("./misc/mailer");
var Nexmo = require("nexmo");
var nexmo = new Nexmo({
	apiKey: "ae31baeb (Master)",
	apiSecret: "QeZ2ezoU6Sdz2Hyu"
});

require("./config/passport");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://tanya:tanya15@ds133570.mlab.com:33570/projectdb");

app.use(express.static(__dirname + "/public"));
app.set("view engine" , "ejs");

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());
app.use(session({
	cookie: { maxAge: 60000},
	secret: "tanyasecret",
	saveUninitialized: false,
	resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
	res.locals.success_messages = req.flash("success");
	res.locals.error_messages = req.flash("error");
	res.locals.isAuthenticated = req.user ? true : false;
	next();
});

//Validation Schema
var userSchema = Joi.object().keys({
	email: Joi.string().email().required(),
	username: Joi.string().required(),
	phoneno: Joi.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/).required(),
	password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
	password_confirm: Joi.any().valid(Joi.ref("password")).required()
});

var port = process.env.PORT || 5000;

app.get("/" , function(req, res) {
	res.render("index");
});


//Authorization function
var isAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()) {
		//continue
		return next();
	} else {
		req.flash("error", "Sorry, You must be registered first");
		res.redirect("/");
	}
};

//NotAuthorization function
var isNotAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()) {
		req.flash("error", "You are already logged in");
		res.redirect("/");
	} else {
		return next();
	}
};


app.get("/register" , isNotAuthenticated, function(req, res) {
	res.render("register");
});

app.post("/register" , async(req, res, next) => {
	try {
	//validation in sign up form
	//first arg tells wha we want to validate, second tells against what we will validate
	var result = Joi.validate(req.body, userSchema);

	/*if(result.error) {
		/*req.flash("error" , "Data is not valid. Try again"); */
		/*console.log(error);
		res.redirect("/register");
		return;
	}*/

	//Checking if email already exist or not
	var user = await User.findOne({"email": result.value.email });
	if(user) {
		req.flash("error" , "Email already in use"); 
		/*console.log(error);*/
		res.redirect("/register");
		return;
	}

	//hash password
	var hash = await User.hashPassword(result.value.password);
	//console.log("hash", hash);

	//Generate secret token
	var secretToken = randomstring.generate();
	console.log("secretToken" , secretToken);

	result.value.secretToken = secretToken;

	//Flag the account as inactive
	result.value.active = false;

	//Save user to db 
	delete result.value.password_confirm;
	result.value.password = hash;

	var newUser = await new User(result.value);
	console.log("newUser" , newUser);
	await newUser.save();
	res.redirect("/verify");

	//Compose Email
    link="http://localhost:5000/verify";

	var output = "Hi There,<br/> Thankyou for registering!<br/><br/. Please verify your email by typing the following token: <br/> Token: <b>${secretToken}</b> <br/> On the following page: <a href="+link+">Click here to verify Email</a> <br/><br/>Have a pleasant day!";

	//Send the email
	await mailgun.messages().send("admin@tanyagoyal15@gmail.com", result.value.email, "Please verify your Email!", output);

	req.flash("success", "Please Check your Email");
	res.redirect("/login");

} catch(error) {
	next(error);
}
});

app.get("/verify" , isNotAuthenticated , function(req, res) {
	res.render("verify");
});

app.post("/verify" , async(req, res, next) => {
	try {
		var secretToken = req.body.secretToken;

	//Find the account that matches the secret token
	var user = await User.findOne({"secretToken": secretToken});
	if(!user) {
		req.flash("error" , "No User Found!");
		res.redirect("/verify");
		return;
	}

	user.active = true;
	user.secretToken = "";
	await user.save();

	req.flash("success" , "Thankyou, Now you may Login"); 
	res.redirect("/login");
	} catch(error) {
		next(error);
	}
});

app.get("/login" , isNotAuthenticated ,function(req, res) {
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/dashboard",
	failureRedirect: "/login",
	failureFlash: true
}));

app.get("/dashboard" , isAuthenticated ,function(req, res) {
	res.render("dashboard");
});

app.get("/logout" , isAuthenticated ,function(req, res) {
	req.flash("success" , "Successfully Logged out");
	req.logout();
	res.redirect("/");	
});

app.get("/phone_verify" , function(req, res) {
	res.render("phone_verify");
});

app.post("/phone_verify", (req, res) => {
  // A user registers with a mobile phone number
  var phoneNumber = req.body.phoneno;
  /*console.log(phoneNumber);*/
  nexmo.verify.request({phoneno: phoneNumber, brand: 'Awesome Company'}, (err, 
  result) => {
    if(err) {
      res.sendStatus(500);
    } else {
      var requestId = result.request_id;
      if(result.status == '0') {
        res.render('otp_verify', {requestId: requestId}); // Success! Now, have your user enter the PIN
      } else {
        res.status(401).send(result.error_text);
      }
    }
  });
});

app.post('/otp_verify', (req, res) => {
  var pin = req.body.pin;
  var requestId = req.body.requestId;

  nexmo.verify.check({request_id: requestId, code: pin}, (err, result) => {
    if(err) {
    	console.log(err);
      // handle the error
    } else {
      if(result && result.status == '0') { // Success!
        res.status(200).send('Account verified!');
        res.render('status', {message: 'Account verified! 🎉'});
      } else {
        // handle the error - e.g. wrong PIN
      }
    }
  });
});


app.listen(port, function(){
	console.log("Server is running");
});
