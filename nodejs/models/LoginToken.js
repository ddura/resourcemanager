var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var LoginTokenSchema = new Schema({
	email: { type: String, index: true },
	series: { type: String, index: true },
	token: { type: String, index: true }
});

LoginTokenSchema.method('randomToken', function() {
	return Math.round((new Date().valueOf() * Math.random())) + '';
});

LoginTokenSchema.pre('save', function(next) {
	this.token = this.randomToken();
	if (this.isNew)
  		this.series = this.randomToken();
	next();
});

LoginTokenSchema.virtual('cookieValue').get(function() {
	return JSON.stringify({ email: this.email, token: this.token, series: this.series });
});
mongoose.model('LoginToken',LoginTokenSchema);