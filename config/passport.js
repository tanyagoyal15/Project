var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("../models/user");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
	try{
		var user = await User.findById(id);
		done(null, user);
	} catch(error) {
		done(error, null);
	}
})

passport.use("local" , new localStrategy({
	usernamefield: "email",
	passwordfield: "password",
	passReqToCallback: false
}, async(email, password, done) => {
	try {
		//1.if the email already exist
		var user = await User.findOne({"email" : email});
		if(!user) {
			return done(null, false, {message: "Unknown User"});
		}

		//2.check either password is correct
		var isValid = User.comparePassword(password, user.password);
		if(!isValid) {
			return done(null, false, {message:"Unkonown Password" });
		}

		//3.Check if the account has been verified.
		if(!user.active) {
			return done(null, false, {message:"You need to verify email first" });
		}
		return done(null, user);
	} catch(error) {
		return done(error, false);
	}
}));