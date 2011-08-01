var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TimeEntrySchema = new Schema({
	entryDate : Date,
	totalHours : Number,
	startTime : Date,
	endTime : Date,
	projectTask : ObjectId,
	user : ObjectId,
	note : String
});

mongoose.model('TimeEntry',TimeEntrySchema);