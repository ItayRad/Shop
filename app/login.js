//jshint esversion:6
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var db = require("./connection.js");
var User = require("./models/user.js");
const bodyParser = require("body-parser");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


router.get("/", function(req, res) {
var errorMsg = "";
  res.render("login.ejs", {errorMsg:errorMsg});
});


    router.post('/', function(req, res, next) {
      const name = req.body.username;
      //const newName = name.charAt(0).toUpperCase() + name.slice(1); // in register it saves only NOT capitalized
      const newName = name.toLowerCase();

      const newuser = new User({
        username: newName,
        password: req.body.password
      });
      passport.authenticate('local', function(err, user, info) {
        if (err) {

          return next(err); // will generate a 500 error
        }
        if (!user) {
          var errorMsg =  "Bad Credentials";
          res.render("login.ejs", {
            errorMsg: errorMsg
          });
          return next(user);
        }
        req.login(newuser, loginErr => {
          if (loginErr) {

            return next(loginErr);
          }
        else {

          res.redirect("/");
        }
        });
      })(req, res, next);
    });
module.exports = router;
