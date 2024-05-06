const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Please enter an email'],
		unique: true,
		lowercase: true,
		validate: [isEmail, 'Please enter a valid email']
	},
	password: {
		type: String,
		required: [true, 'Please enter a password'],
		minlength: [6, 'Minimum password length is 6'],
	}
	});
/**	
userSchema.post('save', async function (doc, next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	console.log('new user was created and saved', doc);
	next();
	});
**/
	
userSchema.pre('save', async function(next) {
	try {
		console.log("debug model 1");
		const salt = await bcrypt.genSalt();
		this.password = await bcrypt.hash(this.password, salt);
		console.log("debug model 2");
		next();
	}
	catch (err) {
		console.log("model err");
		console.log(err);
	}
});

userSchema.statics.login = async function(email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		
		if (auth) {
			return user;
	}
		throw Error('incorrect Password');
	}
	throw Error('incorrect email');
};		
	

const User = mongoose.model('user', userSchema);
module.exports = User;
