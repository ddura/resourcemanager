
var User, LoginToken, Project, ProjectTask, TimeEntry, TimeSheet, Salary, ProjectExpense;

function defineModels( mongoose, fn )
{
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	// Helper Functions
	function validatePresenceOf(value) {
		return value && value.length;
	}

    // User Collection
    SalarySchema = new Schema({
    	salaryType : { type:String, enum:['annual','hourly'] },
    	startDate : { type:Date },
    	endDate : { type:Date },
    	salaryRate : { type:Number },
    	active : { type:Boolean, default:false }
    });

	UserSchema = new Schema({
		'firstname' : String,
		'lastname' : String,
		'email' : { type:String, validate:[validatePresenceOf,'an email is required'], index:{unique:true} },
		'hashedPassword' : String,
		'salt' : String,
		'role' : { type:String, enum:['admin','manager','user'], default:'user' }
		'salaries' : [SalarySchema],
		'currentSalary' : ObjectId,
		'active' : { type:Boolean, default:true }
	});
    UserSchema.virtual('password').set( function(password) {
    	this._password = password;
    	this.salt = this.makeSalt();
    	this.hashedPassword = this.encryptPassword(password);
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
/*
	LoginTokenSchema = new Schema({
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
*/
 	// Project Collection
	ProjectSchema = new Schema({
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

	ProjectTaskSchema = new Schema({
		name : String,
		budgetType : { type:String, enum:['fixedhours','fixedamount'] },
		budget : Number,
		parent : ObjectId
	});

	// TimeEntry Collection
	TimeEntrySchema = new Schema({
		entryDate : Date,
		totalHours : Number,
		startTime : Date,
		endTime : Date,
		projectTask : ObjectId,
		user : ObjectId,
		note : String
	});

	// TimeSheet Collection
	TimeSheetSchema = new Schema({
		timeEntries : [ObjectId],
		startDate : Date,
		endDate : Date,
		status : { type:String, enum:['submitted','approved','rejected'] },
		statusUpdatedBy : ObjectId,
	});
	
	// ProjectExpense Collection
	ProjectExpenseSchema = new Schema({
		project : ObjectId,
		user : ObjectId,
		description : String,
		cost : Number,
		receipt : String
	});

	mongoose.model('ProjectTask',ProjectTaskSchema);
    //mongoose.model('LoginToken',LoginTokenSchema);
	mongoose.model('Salary',SalarySchema);
	mongoose.model('User',UserSchema);
	mongoose.model('TimeEntry',TimeEntrySchema);
	mongoose.model('TimeSheet',TimeSheetSchema);
	mongoose.model('ProjectExpense',ProjectExpenseSchema);

	fn();
}

exports.defineModels = defineModels;