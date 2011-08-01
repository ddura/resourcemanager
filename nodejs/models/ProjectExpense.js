var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProjectExpenseSchema = new Schema({
	project : ObjectId,
	user : ObjectId,
	description : String,
	cost : Number,
	receipt : String
});

mongoose.model('ProjectExpense',ProjectExpenseSchema);