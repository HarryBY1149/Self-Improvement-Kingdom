var db = require("../models");
var isAuthenticated = require("../config/middleware/isAuthenticated");
var passport = require("../config/passport")

module.exports = function (app) {
  app.get("/api/tasks", function (req, res) {
    db.Task.findAll({where: {UserId: req.user.id}}).then(function (allTasks) {
      res.json(allTasks);
    })
  });

  app.post("/api/tasks", function (req, res) {
    var newTask = {
      name: req.body.name,
      category: req.body.category,
      difficulty: req.body.difficulty,
      UserId: req.session.userId
    }
    console.log(newTask)
  db.Task.create(newTask).then(function (newTask) {
    res.json(newTask);
  });
});

  // Processing the local login form
  app.post("/api/login/local",function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      console.log("Here's the returned user: " +user);
      if (err) { 
        return next(err); }
        ;
      if (!user) { 
        return res.redirect('/login', {msg: "Username or Password incorrect, please try again or follow the link to sign up."}); 
      };
      req.logIn(user, function(err) {
        if (err) { 
          return next(err); 
        };
        process.nextTick(function(){res.redirect('/')});
      })
    })(req, res, next);
  }
  );

  // Processing the signup form
  app.post("/api/signup", passport.authenticate('local-signup', {
    successRedirect: "/user",
    failureRedirect: "/signup",
  }));

  // set route for editing individual tasks
  app.set("/api/task/edit", function (req, res) {
    db.Task.update({ taskBody: req.body.text }, { where: { id: req.body.id } }).then(function (task) {
      //returns the updated task, would be lighter on the server to reload this object rather than reloading the whole page
      res.json(task);
    })
  });

  // set route for completing individual tasks
  app.set("/api/task/complete", function (req, res) {
    db.Task.update({ taskCompleted: true }, { where: { id: req.body.id } }).then(function (task) {
      //returns the updated task
      res.json(task);
    })
  });

  // delete route for removing tasks
  app.delete("/api/task/:id", function (req, res) {
    db.Task.destroy({ where: { id: req.params.id } }).then(function (task) {
      res.json(task);
    })
  });


  app.get("/api/army", function (req, res) {
    var playerArmy = {
      knightCount: req.user.knightCount,
      mageCount: req.user.mageCount,
      archerCount: req.user.archerCount
    }
    res.json(playerArmy);
  })
}
