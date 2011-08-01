var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var ProjectTask = mongoose.model('ProjectTask');

exports.createProject = function( name, ownerId, budgetType, budget, next ) {
	console.log('ProjectController.createProject');
	var p = new Project();
	p.name = name;
	p.budgetType = budgetType;
	p.budget = budget;
	p.save( function() {
		next( p );
	});
}

exports.deactivateProject = function( project, next ) {
	console.log('ProjectController.deactivateProject');
	next();
}

exports.updateProject = function( name, ownerId, budgetType, budget, next ) {
	console.log('ProjectController.updateProject');
	next();
}

exports.getProjects = function( next ) {
	console.log('ProjectController.getProjects');
	Project.find( {}, function( err, p ) {
		next(p);
	});
}

exports.getProjectById = function( id, next ) {
	console.log('ProjectController.getProjectById');
	Project.findById( id, function( err, p ) {
		next( p );
	});
}