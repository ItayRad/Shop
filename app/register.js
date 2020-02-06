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
  if (req.isAuthenticated()) {
    res.redirect("./");
  } else {
    res.render("register");
  }
});


router.post("/", function(req, res) {
      const name = req.body.username;
      //const newName = name.charAt(0).toUpperCase() + name.slice(1); // in register it saves only NOT capitalized
      const newName = name.toLowerCase();
      var admin = 0;
      console.log(newName);
      User.register({
          username: newName,
          email: req.body.email,
          admin: admin,
        }, req.body.password, function(err, user) {

          if (err) {
            if (err.code === 11000) {
              res.render("failed.ejs", {
                error: "Email is already taken, please choose another mail"
              });
            } else {
              res.render("failed.ejs", {
                  error: err.message
                });

            }
          }
          else if(!err) {
              console.log("saved " + user.username);
              passport.authenticate('local')(req, res, function() {
                res.render("success.ejs", {

                  content: "Succesfully saved",
                  name: user.username
                });
              });
            }
          });
      });

module.exports = router;
