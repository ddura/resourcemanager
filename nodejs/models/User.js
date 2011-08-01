var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var crypto = require('crypto');

function validatePresenceOf( value ) {
	return value && value.length && value != '';
}

var SalarySchema = new Schema({
	salaryType : { type:String, enum:['annual','hourly'] },
	startDate : { type:Date },
	endDate : { type:Date },
	salaryRate : { type:Number },
	active : { type:Boolean, default:false }
});
mongoose.model('Salary',SalarySchema);

var UserSchema = new Schema({
	firstname : String,
	lastname : String,
	email : { type:String, validate:[validatePresenceOf,'an email is required'], index:{unique:true} },
	hashedPassword : String,
	salt : String,
	role : { type:String, enum:['admin','manager','user'], default:'user' },
	salaries : [SalarySchema],
	currentSalary : ObjectId,
	active : { type:Boolean, default:true }
});
UserSchema.virtual('password').set( function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashedPassword = this.encryptPassword(password);
	console.log('Set password hash using password: '+this.hashedPassword);
});
UserSchema.virtual('password').get( function() { 
    return this._password;
});
UserSchema.methods.authenticate = function(plainText) {
	return this.encryptPassword(plainText) === this.hashedPassword;
};
UserSchema.methods.makeSalt = function() {
	return Math.round((new Date().valueOf() * Math.random())) + '';
};
UserSchema.methods.encryptPassword = function(password){
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};
UserSchema.pre('save', function(next) {
	if( !validatePresenceOf(this.password) ) {
		next( new Error('Invalid password.') );
	} else {
		next();
	}
});
mongoose.model('User',UserSchema);