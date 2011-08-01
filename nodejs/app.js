
// Dependencies
var express = require('express');
var app = module.exports = express.createServer();
var mongoose = require('mongoose');
var fs = require('fs');
var path = __dirname;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.logger());
  app.use(express.errorHandler()); 
});

// Models
var schema;
schema = require('./models/User.js');
schema = require('./models/TimeSheet.js');
schema = require('./models/TimeEntry.js');
schema = require('./models/ProjectExpense.js');
schema = require('./models/Project.js');
schema = require('./models/LoginToken.js');
var db = mongoose.connect('http://localhost/resourcemanager');

var User = mongoose.model('User');

// Controller
var projectController = require('./controllers/ProjectController.js');
var userController = require('./controllers/UserController.js')(app);

// Routes

app.get('/', function(req, res) {
  res.render('dashboard.jade', { locals: { title:'Dashboard' } } );
});

// Methods

// LOGIN
app.get('/login.:format?', function( req, res ) {
  //userController.authenticateUser();
});

// GET USERS
app.get('/users.:format?', function( req, res ) {
  console.log('Getting user page.');
  userController.getUsers( function( err, users ) {
    switch( req.params.format ) {
      case 'json' : res.send( users.map( function (u) {
        return u.toObject();
      })); break;
      default : res.render('users/index.jade', { locals:{ users:users, title:'Users' } } ); break;
    }
  });
});

// CREATE USER
app.get('/users/new', function( req, res ) {
  res.render( 'users/new.jade', { locals:{ user:new User(), title:'New User' } } );
});
app.post('/users.:format?', function( req, res ) {
  userController.createUser( req.body.user.email, req.body.user.firstname, req.body.user.lastname, req.body.user.password, req.body.user.role, function( err, user ) {
    switch( req.params.format ) {
      case 'json' : res.send( user.toObject() ); break;
      default : res.redirect('/users'); break;
    }  
  })
});

// GET ALL PROJECTS
app.get('/projects.:format?', function( req, res ) {
  projectController.getProjects( function( projects ) {
    switch( req.params.format ) {
      case 'json' :
        res.send( projects.map( function(p) {
          return p.toObject();
        }))
      break;
      default:
        res.render('projects/index.jade', {
          locals : { title:"Projects", projects: projects }
        })
      break;
    }
  })
});

app.get('/projects/:id.:format?/edit', function( req, res ) {
  projectController.getProjectById( req.params.id, function( p ) {
    res.render('projects/edit.jade', {
      locals: { p:p, title:"Edit Project" }
    })
  })
})

// CREATE PROJECT

app.get('/projects/new', function( req, res ) {
  res.render('projects/new.jade', {
    locals: { p: new Project(), title: "New Project" }
  })
})
app.post('/projects.:format?', function( req, res ) {
  projectController.createProject( req.body.p.name, null, req.body.p.budgetType, req.body.p.budget, function( p ) {
    switch( req.params.format ) {
      case 'json':
        res.send( p.toObject() )
        break;
      default:
        res.redirect('/projects');
    }    
  });
});

// GET PROJECT BY ID
app.get('/projects/:id.:format?', function( req, res ) {
  projectController.getProjectById( req.params.id, function(p) {
    switch(req.params.format) {
      case 'json' : res.send( d.toObject() ); break;
      default : res.render('projects/detail.jade', { locals: { p:p, title:'Project Detail' } } );
    }
  });
});

// UPDATE PROJECT BY ID
app.put('/projects/:id.:format?', function( req, res ) {
  projectController.getProjectById( req.params.id, function( p ) {
    p.name = req.body.p.name;
    p.budgetType = req.body.p.budgetType;
    p.budget = req.body.p.budget;
    p.save( function() {
      switch( req.params.format ) {
        case 'json' : res.send( p.toObject() ); break;
        default : res.redirect('/projects');
      }
    })
  })
});


// REMOVE PROJECT
app.del('/projects/:id.:format?', function( req, res ) {
  Project.findById( req.params.id, function( err, p ) {
    p.active = false;
    p.save( function() {
      switch( req.params.format ) {
        case 'json' : res.send( p.toObject() ); break;
        default : res.redirect('/projects');
      }      
    })
  })
});

// Boiler plate

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
