var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProjectTaskSchema = new Schema({
	name : String,
	budgetType : { type:String, enum:['fixedhours','fixedamount'] },
	budget : Number,
	parent : ObjectId
});
mongoose.model('ProjectTask',ProjectTaskSchema);

var ProjectSchema = new Schema({
	name : { type:String },
	projectOwner : ObjectId,
	budgetType : { type:String, enum : ['fixedbid','tam','costplus'] },
	budget : {type:Number},
	projectedStartDate : {type:Date},
	projectedEndDate : {type:Date},
	projectTasks : [ProjectTaskSchema],
	active: {type:Boolean, default:true }
});
mongoose.model('Project',ProjectSchema);


