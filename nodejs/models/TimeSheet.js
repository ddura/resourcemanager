var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TimeSheetSchema = new Schema({
	timeEntries : [ObjectId],
	startDate : Date,
	endDate : Date,
	status : { type:String, enum:['submitted','approved','rejected'] },
	statusUpdatedBy : ObjectId,
});

mongoose.model('TimeSheet',TimeSheetSchema);