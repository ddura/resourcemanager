var mongoose = require('mongoose');
var User = mongoose.model('User');
var LoginToken = mongoose.model('LoginToken');

// User Session Management
exports.authenticateUser = function( email, password, next ) {
	LoginToken.remove( {email:email}, function() {	
		User.findOne( {email:email}, function( err, user ) {
			if( user && user.authenticate(password) ) {
				var loginToken = new LoginToken( { email:email } );
				loginToken.save( function() {
					next( null, loginToken );
				})
			} else {
				next( new Error("Invalid credentials.") );
			}
		});
	});
}

exports.deauthenticateUser = function( email, token, next ) {
	LoginToken.remove( { email:email, token:token }, function( err ) {
		next( err );
	});
}

exports.authenticationPint = function( email, token, next ) {
	LoginToken.find( { email:email, token:token }, function( err, token ) {
		next( err, token );
	});
}

exports.getUserForToken = function( email, token, next ) {
	LoginToken.find( {email:email, token:token}, function( err, token ) {
		if( token ) {			
			User.find( {email:email }, function( err, user ) {
				if( user ) {
					next( null, user );
				} else {
					next( new Error('Invalid token.') );
				}
			});
		} else {
			next( new Error('Invalid token.') );
		}
	});
}

// User Management
exports.createUser = function( email, firstname, lastname, password, role, next ) {
	var user = new User({
		email: email,
		firstname: firstname,
		lastname: lastname,
		password: password,
		role: role,
		active: true
	});
	user.save( function( err ) {
		console.log('Creating user: ' + user.toObject()+
					' hash:' + user.hashedPassword +
					' salt:' + user.salt );
		next( err, user );
	});
}

exports.deactivateUser = function( userId, next ) {
	next( user );
}

exports.getUsers = function( next ) {
	console.log('UserController.getUser');
	User.find( {}, function( err, users ) {
		console.log('Retreived users.');
		next( err, users );
	});
}

exports.addSalary = function( userId, salaryType, startDate, endDate, rate, next ) {
	next();
}

exports.setCurrentSalary = function( userId, salaryId, next ) {
	next();
}

exports.updateSalary = function( salaryId, salaryType, startDate, endDate, rate, next ) {
	next();
}

exports.getSalariesForUser = function( userId, next ) {
	next();
}