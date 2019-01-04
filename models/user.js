var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

var userSchema = new Schema({
	email: String, 
	username : String,
	phoneno: String,
	password: String,
	secretToken: String,
	active: Boolean,
	/*pin: String,
	requestid: String,*/
}, {
	timestamps: {
		createdAt: "createdAt",
		updatedAt: "updatedAt"
	}
});

var User = mongoose.model("user", userSchema); // built object using schema
module.exports = User;  //export it so that other file can access it.

module.exports.hashPassword = async(password) => {
	try{
		var salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	} catch(error){
		throw new Error("Hashing Failed", error); 
	}
};
module.exports.comparePassword = async(inputPassword, hashedPassword) => {
	try {
		return await bcrypt.compare(inputPassword, hashedPassword);
	}catch(error) {
		throw new Error("Comparing Failed", error);
	}
}